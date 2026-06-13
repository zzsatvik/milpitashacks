import type { VercelRequest, VercelResponse } from "@vercel/node";
import { enrichAnalysisWithLiveStores, type LawnAnalysis } from "@terraview/shared";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GOOGLE_MAPS_API_KEY not configured" });
  }

  const zipCode =
    typeof req.body?.zipCode === "string"
      ? req.body.zipCode.trim().slice(0, 10)
      : "";
  if (!/^\d{5}$/.test(zipCode)) {
    return res.status(400).json({ error: "Expected { analysis, zipCode: 5-digit US ZIP }" });
  }

  if (!req.body?.analysis || typeof req.body.analysis !== "object") {
    return res.status(400).json({ error: "Expected analysis object" });
  }

  try {
    const result = await enrichAnalysisWithLiveStores(
      req.body.analysis as LawnAnalysis,
      zipCode,
      apiKey,
    );
    return res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Store lookup failed";
    return res.status(502).json({ error: message });
  }
}
