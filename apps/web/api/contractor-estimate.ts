import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  generateContractorEstimate,
  type LawnAnalysis,
  type LawnZone,
} from "@terraview/shared";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  const zipCode =
    typeof req.body?.zipCode === "string" ? req.body.zipCode.trim().slice(0, 10) : "";
  if (!/^\d{5}$/.test(zipCode) || !req.body?.analysis || !req.body?.zone) {
    return res.status(400).json({ error: "Expected { analysis, zone, zipCode }" });
  }

  try {
    const result = await generateContractorEstimate(
      req.body.zone as LawnZone,
      req.body.analysis as LawnAnalysis,
      zipCode,
      apiKey,
    );
    return res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Estimate failed";
    return res.status(502).json({ error: message });
  }
}
