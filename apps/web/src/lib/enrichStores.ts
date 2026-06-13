import type { LawnAnalysis } from "@terraview/shared";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function enrichAnalysisStores(
  analysis: LawnAnalysis,
  zipCode: string,
): Promise<LawnAnalysis> {
  const response = await fetch(`${API_BASE}/api/stores/enrich`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, zipCode }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error ?? `Store lookup failed (${response.status})`);
  }

  return response.json() as Promise<LawnAnalysis>;
}
