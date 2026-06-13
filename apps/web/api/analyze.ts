import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callOpenAiAnalyze } from "@lawn-audit/shared";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  const image = req.body?.image;
  if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
    return res.status(400).json({ error: "Expected { image: data URL }" });
  }

  const zipCode =
    typeof req.body?.zipCode === "string" && req.body.zipCode.trim()
      ? req.body.zipCode.trim().slice(0, 10)
      : undefined;

  try {
    const result = await callOpenAiAnalyze(image, apiKey, zipCode);
    return res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return res.status(502).json({ error: message });
  }
}
