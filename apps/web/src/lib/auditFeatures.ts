import type { AuditInsights, ChatMessage, ContractorEstimate, LawnAnalysis, LawnZone, PlantIdentification } from "@terraview/shared";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchAuditInsights(
  analysis: LawnAnalysis,
  zipCode: string,
): Promise<AuditInsights> {
  const response = await fetch(`${API_BASE}/api/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, zipCode }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error ?? `Insights failed (${response.status})`);
  }

  return response.json() as Promise<AuditInsights>;
}

export async function fetchContractorEstimate(
  analysis: LawnAnalysis,
  zone: LawnZone,
  zipCode: string,
): Promise<ContractorEstimate> {
  const response = await fetch(`${API_BASE}/api/contractor-estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, zone, zipCode }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error ?? `Estimate failed (${response.status})`);
  }

  return response.json() as Promise<ContractorEstimate>;
}

export async function fetchPlantIdentification(
  croppedImage: string,
  zone: LawnZone,
  zipCode: string,
): Promise<PlantIdentification> {
  const response = await fetch(`${API_BASE}/api/identify-plant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: croppedImage, zone, zipCode }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error ?? `Plant ID failed (${response.status})`);
  }

  return response.json() as Promise<PlantIdentification>;
}

export async function sendChatMessage(
  analysis: LawnAnalysis,
  messages: ChatMessage[],
  zipCode?: string,
  insights?: AuditInsights | null,
): Promise<string> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, messages, zipCode, insights }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error ?? `Chat failed (${response.status})`);
  }

  const data = (await response.json()) as { reply: string };
  return data.reply;
}
