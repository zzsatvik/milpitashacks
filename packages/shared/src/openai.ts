import type { LawnAnalysis } from "./types";

const BASE_SCHEMA = `{
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
      "after_suggestion": "concise swap suggestion for numbered list UI",
      "action_plan": {
        "steps": ["step-by-step what to do in order"],
        "items": [
          {
            "name": "specific product or material",
            "quantity": "e.g. 2 cu yd or 3 plants",
            "purpose": "why you need it"
          }
        ],
        "where_to_buy": [
          {
            "store_name": "e.g. Home Depot or local nursery name",
            "distance": "e.g. ~2.1 mi",
            "address_hint": "street or shopping center if known",
            "notes": "what aisle/section or seasonal availability"
          }
        ]
      }
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
  "summary": "2-3 sentence overall assessment",
  "location": {
    "zip_code": "provided zip",
    "region_hint": "city/region name",
    "climate_note": "brief local climate relevance"
  },
  "regional_tips": ["2-4 bullets with zip-specific native plant or water rules"]
}`;

export function buildAnalyzeSystemPrompt(zipCode?: string): string {
  const locationRules = zipCode
    ? `
Location context: ZIP code ${zipCode} (United States).
- Tailor ALL plant species, materials, and store recommendations to this zip's climate zone and region.
- In where_to_buy, suggest realistic nearby retailers (Home Depot, Lowe's, Ace Hardware, local nurseries) with plausible distance estimates from that zip.
- Prefer California-native or region-appropriate drought-tolerant species when the zip is in a dry climate.
- Include location.zip_code as "${zipCode}" in the response.`
    : `
- If no zip provided, use generic US recommendations and omit location/regional_tips or use broad defaults.`;

  return `You are an expert in sustainable landscaping, xeriscaping, and ecological yard design.
Analyze the uploaded yard/lawn photo and return ONLY valid JSON (no markdown fences) matching this schema:

${BASE_SCHEMA}

Rules:
- bbox coordinates are fractions 0.0-1.0 of image width/height (x,y = top-left)
- Identify 4-8 distinct zones (turf, natives, hardscape, bare soil, trees, mulch beds, standing water, etc.)
- severity: "high" = urgent issue, "moderate" = worth addressing, "good" = positive feature
- after_suggestion: one concise sentence for the numbered list UI
- action_plan is REQUIRED for every zone with severity "high" or "moderate"; optional but encouraged for "good" zones
- action_plan.items: 2-5 specific purchasable items with quantities
- action_plan.where_to_buy: 1-3 store options with realistic distance estimates
- action_plan.steps: 3-6 ordered installation/maintenance steps
- Be specific and actionable — name actual products (mulch type, plant species, fertilizer NPK)
${locationRules}
- Estimate realistic water/CO2 impacts for the region`;
}

export async function callOpenAiAnalyze(
  imageDataUrl: string,
  apiKey: string,
  zipCode?: string,
): Promise<LawnAnalysis> {
  const userText = zipCode
    ? `Analyze this yard photo for sustainability. User ZIP code: ${zipCode}. Return structured JSON only.`
    : "Analyze this yard photo for sustainability. Return structured JSON only.";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 8192,
      messages: [
        { role: "system", content: buildAnalyzeSystemPrompt(zipCode) },
        {
          role: "user",
          content: [
            { type: "text", text: userText },
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
