import type { LawnAnalysis } from "./types";

export const ANALYZE_SYSTEM_PROMPT = `You are an expert in sustainable landscaping, xeriscaping, and ecological yard design.
Analyze the uploaded yard/lawn photo and return ONLY valid JSON (no markdown fences) matching this schema:

{
  "zones": [
    {
      "id": 1,
      "label": "short zone label",
      "bbox": { "x": 0.1, "y": 0.2, "width": 0.4, "height": 0.3 },
      "severity": "high" | "moderate" | "good",
      "issue": "what the problem or positive is",
      "recommendation": "specific fix recommendation",
      "water_impact": "e.g. saves ~3,000 gal/yr",
      "co2_impact": "carbon impact estimate",
      "after_suggestion": "concise swap suggestion, e.g. Replace turf with native poppies + decomposed granite → saves ~2,400 gal/yr"
    }
  ],
  "scores": {
    "water_efficiency": 0-100,
    "biodiversity": 0-100,
    "heat_island_risk": "high" | "medium" | "low",
    "carbon_sequestration": "high" | "medium" | "low",
    "soil_health": "high" | "medium" | "low",
    "overall_grade": "letter grade like B-",
    "estimated_water_waste_gal": number,
    "potential_co2_sequestration_lbs": number
  },
  "summary": "2-3 sentence overall assessment"
}

Rules:
- bbox coordinates are fractions 0.0-1.0 of image width/height (x,y = top-left)
- Identify 4-8 distinct zones (turf, natives, hardscape, bare soil, trees, mulch beds, standing water, etc.)
- severity: "high" = urgent issue, "moderate" = worth addressing, "good" = positive feature
- Be specific and actionable in recommendations
- after_suggestion should be a single readable sentence for a numbered list UI
- Estimate realistic water/CO2 impacts for the region visible`;

export async function callOpenAiAnalyze(
  imageDataUrl: string,
  apiKey: string,
): Promise<LawnAnalysis> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 4096,
      messages: [
        { role: "system", content: ANALYZE_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this yard photo for sustainability. Return structured JSON only.",
            },
            {
              type: "image_url",
              image_url: { url: imageDataUrl, detail: "high" },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No response from vision model");
  }

  const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as LawnAnalysis;
}
