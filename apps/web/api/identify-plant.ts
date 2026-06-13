import type { VercelRequest, VercelResponse } from "@vercel/node";
import { identifyPlantInCrop, type LawnZone } from "@terraview/shared";

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
  const image = req.body?.image;
  if (!/^\d{5}$/.test(zipCode) || !image?.startsWith("data:image/") || !req.body?.zone) {
    return res.status(400).json({ error: "Expected { image, zone, zipCode }" });
  }

  try {
    const result = await identifyPlantInCrop(
      image,
      req.body.zone as LawnZone,
      zipCode,
      apiKey,
    );
    return res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Plant identification failed";
    return res.status(502).json({ error: message });
  }
}
