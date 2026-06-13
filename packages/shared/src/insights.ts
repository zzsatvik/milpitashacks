import { callOpenAiJson, callOpenAiText } from "./ai";
import type {
  AuditInsights,
  ChatMessage,
  ContractorEstimate,
  PlantIdentification,
  WaterBillBreakdown,
  ZipWaterBenchmark,
} from "./insights-types";
import type { LawnAnalysis, LawnZone } from "./types";

const INSIGHTS_SCHEMA = `{
  "seasonal": {
    "months": [
      {
        "month": 1,
        "month_label": "Jan",
        "water_waste_gal": number,
        "heat_index": 0-100,
        "water_multiplier": number
      }
    ],
    "peak_month": "August",
    "peak_water_multiplier": number,
    "peak_heat_month": "July",
    "headline": "In August, this lawn wastes 3x more water than in March.",
    "climate_zone": "e.g. Mediterranean / Humid subtropical"
  },
  "zip_benchmark": {
    "zip_average_monthly_bill_usd": number,
    "avg_gallons_per_month": number,
    "typical_lawn_share_pct": number,
    "utility_name": "local water utility name if known"
  },
  "swap_rois": [
    {
      "zone_id": number,
      "swap_label": "short label",
      "upfront_cost_usd": number,
      "annual_water_savings_usd": number,
      "annual_maintenance_savings_usd": number,
      "rebate_usd": number,
      "rebate_program": "program name or null",
      "break_even_months": number,
      "five_year_net_usd": number,
      "summary": "one sentence ROI pitch"
    }
  ]
}`;

export async function generateAuditInsights(
  analysis: LawnAnalysis,
  zipCode: string,
  apiKey: string,
): Promise<AuditInsights> {
  const zoneSummary = analysis.zones
    .map(
      (z) =>
        `Zone ${z.id} "${z.label}" [${z.severity}]: ${z.issue}. Rec: ${z.recommendation}. Swap: ${z.after_suggestion ?? "n/a"}`,
    )
    .join("\n");

  const systemPrompt = `You are a sustainable landscaping economist and climate analyst.
Given a yard audit for US ZIP ${zipCode}, return ONLY valid JSON (no markdown) matching:

${INSIGHTS_SCHEMA}

Rules:
- seasonal.months MUST include all 12 months (Jan–Dec)
- Base monthly water_waste_gal on audit scores.estimated_water_waste_gal / 12, then apply realistic seasonal multipliers for ZIP ${zipCode}'s climate (summer peaks in dry/hot regions)
- water_multiplier is relative to the lowest-waste month (typically winter), minimum 1.0
- heat_index 0-100 reflects heat island stress by month for THIS yard's hardscape/turf mix
- headline must cite the peak month and multiplier vividly
- zip_benchmark: realistic local utility bill and lawn irrigation share for the ZIP
- swap_rois: one entry per zone with severity "high" or "moderate"; include real rebate programs when they exist for the region (e.g. Valley Water turf rebate for 950xx)
- Use USD integers, realistic DIY material costs for the region
- break_even_months = upfront_cost_usd / ((annual_water_savings_usd + annual_maintenance_savings_usd) / 12), rounded
- five_year_net_usd = (annual_water_savings_usd + annual_maintenance_savings_usd) * 5 + rebate_usd - upfront_cost_usd`;

  const userText = `Audit summary: ${analysis.summary}

Scores: water ${analysis.scores.water_efficiency}/100, biodiversity ${analysis.scores.biodiversity}/100, heat risk ${analysis.scores.heat_island_risk}, estimated annual water waste ${analysis.scores.estimated_water_waste_gal ?? "unknown"} gal.

Zones:
${zoneSummary}

Generate insights JSON for ZIP ${zipCode}.`;

  return callOpenAiJson<AuditInsights>(apiKey, systemPrompt, userText, {
    maxTokens: 8192,
  });
}

export function computeWaterBillBreakdown(
  analysis: LawnAnalysis,
  userMonthlyBill: number,
  benchmark: ZipWaterBenchmark,
): WaterBillBreakdown {
  const wasteGal = analysis.scores.estimated_water_waste_gal ?? 0;
  const waterScore = analysis.scores.water_efficiency;

  const inefficiencyFactor = Math.max(0, (100 - waterScore) / 100);
  const lawnSharePct = Math.min(
    85,
    Math.max(
      benchmark.typical_lawn_share_pct * (0.6 + inefficiencyFactor * 0.8),
      wasteGal > 5000 ? 35 : 20,
    ),
  );

  const lawnBillPortion = userMonthlyBill * (lawnSharePct / 100);
  const avoidablePct = Math.min(0.75, inefficiencyFactor * 0.85 + 0.15);
  const avoidableMonthly = Math.round(lawnBillPortion * avoidablePct);
  const wastedOnLandscaping = Math.round(lawnBillPortion);

  const vsZip = Math.round(userMonthlyBill - benchmark.zip_average_monthly_bill_usd);

  const headline =
    avoidableMonthly > 0
      ? `You're paying ~$${avoidableMonthly}/month more than you need to on inefficient landscaping.`
      : `Your water bill is already lean for outdoor use in this ZIP.`;

  return {
    user_monthly_bill_usd: userMonthlyBill,
    zip_average_bill_usd: benchmark.zip_average_monthly_bill_usd,
    estimated_lawn_share_pct: Math.round(lawnSharePct),
    wasted_on_landscaping_usd: wastedOnLandscaping,
    avoidable_monthly_usd: avoidableMonthly,
    vs_zip_average_usd: vsZip,
    headline,
  };
}

const CONTRACTOR_SCHEMA = `{
  "zone_id": number,
  "diy": {
    "materials_usd": number,
    "hours": number,
    "difficulty": "easy" | "moderate" | "hard",
    "summary": "string",
    "line_items": ["string"]
  },
  "professional": {
    "labor_usd": number,
    "materials_usd": number,
    "total_usd": number,
    "timeline": "e.g. 1-2 days",
    "summary": "string",
    "line_items": ["string"]
  }
}`;

export async function generateContractorEstimate(
  zone: LawnZone,
  analysis: LawnAnalysis,
  zipCode: string,
  apiKey: string,
): Promise<ContractorEstimate> {
  const systemPrompt = `You are a landscaping cost estimator for US ZIP ${zipCode}.
Return ONLY valid JSON (no markdown) matching:

${CONTRACTOR_SCHEMA}

Rules:
- Realistic 2024-2025 regional labor rates for the ZIP's metro area
- DIY materials at retail prices; professional includes labor + materials + 15% overhead
- line_items: 3-5 specific cost breakdown bullets each
- zone_id must be ${zone.id}`;

  const userText = `Zone: "${zone.label}" [${zone.severity}]
Issue: ${zone.issue}
Recommendation: ${zone.recommendation}
Swap: ${zone.after_suggestion ?? "n/a"}
Action plan items: ${JSON.stringify(zone.action_plan?.items ?? [])}
Overall yard grade: ${analysis.scores.overall_grade}

Estimate DIY vs professional costs.`;

  return callOpenAiJson<ContractorEstimate>(apiKey, systemPrompt, userText);
}

const PLANT_ID_SCHEMA = `{
  "common_name": "string",
  "scientific_name": "string or null",
  "confidence": "high" | "medium" | "low",
  "invasive_risk": "none / low / moderate / high — with brief reason",
  "water_needs": "e.g. High — ~40 gal/sq ft/yr",
  "native_status": "native to region / non-native ornamental / unknown",
  "care_notes": "2-3 sentences",
  "swap_suggestion": "optional native alternative if non-native or high water"
}`;

export async function identifyPlantInCrop(
  croppedImageDataUrl: string,
  zone: LawnZone,
  zipCode: string,
  apiKey: string,
): Promise<PlantIdentification> {
  const systemPrompt = `You are a botanist and invasive species specialist for US ZIP ${zipCode}.
Identify the dominant plant(s) visible in this cropped yard photo region labeled "${zone.label}".
Return ONLY valid JSON (no markdown) matching:

${PLANT_ID_SCHEMA}

Rules:
- If turf grass, identify species type (e.g. tall fescue, bermuda, kentucky bluegrass) if possible
- Flag invasive species common in the region (e.g. pampas grass in CA)
- Tailor native_status to the ZIP's state/region
- Be honest about confidence if image is unclear`;

  return callOpenAiJson<PlantIdentification>(
    apiKey,
    systemPrompt,
    [
      {
        type: "text",
        text: `Zone context: ${zone.issue}. What plant is this?`,
      },
      {
        type: "image_url",
        image_url: { url: croppedImageDataUrl, detail: "high" },
      },
    ],
    { maxTokens: 1024 },
  );
}

export function buildChatSystemPrompt(
  analysis: LawnAnalysis,
  zipCode?: string,
  insights?: AuditInsights | null,
): string {
  const zoneList = analysis.zones
    .map((z) => `- Zone ${z.id} ${z.label} (${z.severity}): ${z.after_suggestion ?? z.recommendation}`)
    .join("\n");

  const roiList = insights?.swap_rois
    .map((r) => `- Zone ${r.zone_id}: ${r.swap_label} — break-even ${r.break_even_months} mo, 5yr net $${r.five_year_net_usd}`)
    .join("\n") ?? "";

  return `You are Terraview, a friendly sustainable landscaping advisor.
The user completed a yard audit${zipCode ? ` for ZIP ${zipCode}` : ""}.

AUDIT CONTEXT:
Summary: ${analysis.summary}
Grade: ${analysis.scores.overall_grade}
Water efficiency: ${analysis.scores.water_efficiency}/100
Biodiversity: ${analysis.scores.biodiversity}/100
Heat island risk: ${analysis.scores.heat_island_risk}
Annual water waste estimate: ${analysis.scores.estimated_water_waste_gal ?? "unknown"} gal

Zones:
${zoneList}

${insights?.seasonal.headline ? `Seasonal note: ${insights.seasonal.headline}` : ""}
${roiList ? `\nROI highlights:\n${roiList}` : ""}

Guidelines:
- Answer follow-up questions using this audit context (priorities, budget, pets, HOAs, timing)
- Be specific, practical, and encouraging — not preachy
- If asked about costs, reference ROI and rebates when relevant
- Keep responses concise (2-4 short paragraphs max unless user asks for detail)
- You can discuss general landscaping topics relevant to their yard
- Do not invent audit data not in context; say when you're estimating`;
}

export async function chatWithAuditContext(
  analysis: LawnAnalysis,
  messages: ChatMessage[],
  apiKey: string,
  zipCode?: string,
  insights?: AuditInsights | null,
): Promise<string> {
  const systemPrompt = buildChatSystemPrompt(analysis, zipCode, insights);
  const apiMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return callOpenAiText(apiKey, systemPrompt, apiMessages);
}
