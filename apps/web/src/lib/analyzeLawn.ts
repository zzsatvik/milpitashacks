import type { LawnAnalysis } from "@lawn-audit/shared";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function analyzeLawnImage(
  imageDataUrl: string,
  zipCode?: string,
): Promise<LawnAnalysis> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: imageDataUrl,
      ...(zipCode ? { zipCode } : {}),
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error ?? `Analysis failed (${response.status})`);
  }

  return response.json() as Promise<LawnAnalysis>;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function urlToDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return fileToDataUrl(new File([blob], "demo.jpg", { type: blob.type }));
}
