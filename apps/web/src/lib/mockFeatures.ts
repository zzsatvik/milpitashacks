import type { ContractorEstimate, LawnZone, PlantIdentification } from "@terraview/shared";

export function mockPlantIdentification(zone: LawnZone): PlantIdentification {
  const isTurf = /turf|grass|lawn/i.test(zone.label);
  return {
    common_name: isTurf ? "Tall fescue turf grass" : zone.label,
    scientific_name: isTurf ? "Festuca arundinacea" : undefined,
    confidence: "medium",
    invasive_risk: isTurf ? "none — cultivated turf species" : "low for ornamentals",
    water_needs: isTurf ? "High — ~40–55 gal/sq ft/yr in summer" : "Moderate — check species",
    native_status: isTurf ? "non-native cool-season turf" : "likely non-native ornamental",
    care_notes:
      "Identification based on zone context in demo mode. Upload a real photo for species-level vision ID.",
    swap_suggestion: isTurf
      ? "Consider native yarrow, sedges, or drought-tolerant ground cover."
      : undefined,
  };
}

export function mockContractorEstimate(zone: LawnZone): ContractorEstimate {
  const isLarge = zone.severity === "high";
  return {
    zone_id: zone.id,
    diy: {
      materials_usd: isLarge ? 380 : 220,
      hours: isLarge ? 16 : 6,
      difficulty: isLarge ? "moderate" : "easy",
      summary: "Weekend project with basic tools; biggest cost is materials and disposal.",
      line_items: [
        "Sheet mulch / sod cutter rental: $45–80",
        "Decomposed granite or mulch: $120–200",
        "Plants or seed: $60–150",
        "Drip irrigation parts: $40–90",
      ],
    },
    professional: {
      labor_usd: isLarge ? 1200 : 650,
      materials_usd: isLarge ? 520 : 310,
      total_usd: isLarge ? 1720 : 960,
      timeline: isLarge ? "2–3 days" : "1 day",
      summary: "Licensed landscaper handles removal, grading, planting, and irrigation tie-in.",
      line_items: [
        "Turf removal & haul-off",
        "Soil prep and grading",
        "Materials and plant install",
        "Irrigation retrofit",
        "Cleanup & warranty",
      ],
    },
  };
}

export function mockChatReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("500") || lower.includes("budget")) {
    return "With a $500 budget, start with the highest-severity turf zone: sheet-mulch a manageable patch (200–400 sq ft), add native plugs, and skip professional install. That alone can cut summer water use 15–25% while you plan larger swaps. Check your water district rebate — many cover $2–5 per sq ft of turf removed, which could refund most of your spend.";
  }
  if (lower.includes("dog") || lower.includes("pet")) {
    return "You can keep a dog-friendly grass lane without maintaining a full lawn. Consider 200–400 sq ft of tall fescue or UC Verde hybrid bermuda in a shaded run area, bordered by native shrubs for biodiversity. The rest of the yard can convert to mulch paths and low-water natives. Avoid sharp gravel where pets run, and rinse paws after DG in dry months.";
  }
  if (lower.includes("first") || lower.includes("priority")) {
    return "Prioritize zones marked Urgent (red) first — usually water-hungry turf or bare soil. Turf replacement delivers the biggest water and heat-island win per dollar. Native shrub zones can wait; they're already helping pollinators. If rebates exist in your ZIP, time turf removal to match program windows (often fall–spring).";
  }
  return "Based on your audit, focus on reducing turf area and adding mulch or native ground cover in the highest-severity zones. I can help you prioritize by budget, timeline, pets, or HOA rules — just ask!";
}
