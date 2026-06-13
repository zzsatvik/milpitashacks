import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  chatWithAuditContext,
  type AuditInsights,
  type ChatMessage,
  type LawnAnalysis,
} from "@terraview/shared";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  if (!req.body?.analysis || !Array.isArray(req.body?.messages)) {
    return res.status(400).json({ error: "Expected { analysis, messages }" });
  }

  const zipCode =
    typeof req.body?.zipCode === "string" && /^\d{5}$/.test(req.body.zipCode.trim())
      ? req.body.zipCode.trim()
      : undefined;

  try {
    const reply = await chatWithAuditContext(
      req.body.analysis as LawnAnalysis,
      req.body.messages as ChatMessage[],
      apiKey,
      zipCode,
      (req.body.insights as AuditInsights | null) ?? null,
    );
    return res.status(200).json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed";
    return res.status(502).json({ error: message });
  }
}
