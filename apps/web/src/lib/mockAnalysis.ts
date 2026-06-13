import type { LawnAnalysis } from "@lawn-audit/shared";

export const MOCK_ANALYSIS: LawnAnalysis = {
  summary:
    "Your lawn is dominated by water-intensive turf with limited native planting. Hardscape and bare soil patches increase heat retention and erosion risk. Targeted swaps could save thousands of gallons annually while boosting biodiversity.",
  scores: {
    water_efficiency: 34,
    biodiversity: 61,
    heat_island_risk: "high",
    carbon_sequestration: "low",
    soil_health: "medium",
    overall_grade: "D+",
    estimated_water_waste_gal: 8200,
    potential_co2_sequestration_lbs: 180,
  },
  zones: [
    {
      id: 1,
      label: "Grass-heavy turf",
      bbox: { x: 0.08, y: 0.35, width: 0.55, height: 0.42 },
      severity: "high",
      issue: "High water consumption, low biodiversity",
      recommendation:
        "Replace with native bunch grasses, clover lawn, or drought-tolerant ground cover",
      water_impact: "saves ~3,000 gal/yr",
      co2_impact: "neutral → +20 lbs/yr with natives",
      after_suggestion:
        "Replace with California poppies + decomposed granite → saves ~2,400 gal/yr",
    },
    {
      id: 2,
      label: "Native shrubs",
      bbox: { x: 0.68, y: 0.12, width: 0.26, height: 0.28 },
      severity: "good",
      issue: "Low water, supports local pollinators",
      recommendation: "Maintain and expand — great biodiversity anchor",
      water_impact: "already optimal",
      co2_impact: "+12 lbs/yr sequestered",
      after_suggestion: "Expand native bed with sage and yarrow",
    },
    {
      id: 3,
      label: "Bare soil patch",
      bbox: { x: 0.62, y: 0.55, width: 0.18, height: 0.15 },
      severity: "moderate",
      issue: "Erosion risk, low carbon sequestration",
      recommendation: "Mulch or plant ground cover to stabilize soil",
      water_impact: "reduces runoff",
      co2_impact: "+8 lbs/yr with cover crop",
      after_suggestion: "Add mulch + creeping thyme → retains moisture",
    },
    {
      id: 4,
      label: "Concrete driveway",
      bbox: { x: 0.02, y: 0.05, width: 0.22, height: 0.88 },
      severity: "moderate",
      issue: "Heat island contributor, zero water absorption",
      recommendation:
        "Consider permeable pavers or shade trees along edge",
      water_impact: "perm. pavers capture ~200 gal/storm",
      co2_impact: "neutral",
      after_suggestion:
        "Permeable pavers + shade tree → -4°F surface temp",
    },
    {
      id: 5,
      label: "Lawn edge / pavement",
      bbox: { x: 0.22, y: 0.72, width: 0.35, height: 0.12 },
      severity: "high",
      issue: "Irrigation runoff likely at hardscape boundary",
      recommendation:
        "Install buffer strip or rain garden to capture runoff",
      water_impact: "captures ~500 gal per storm event",
      co2_impact: "+15 lbs/yr with plantings",
      after_suggestion:
        "Add rain garden here → captures 500 gal per storm event",
    },
    {
      id: 6,
      label: "Large shade tree",
      bbox: { x: 0.72, y: 0.42, width: 0.22, height: 0.38 },
      severity: "good",
      issue: "Excellent carbon sequestration and cooling",
      recommendation: "Protect root zone; avoid over-mulching trunk",
      water_impact: "reduces evaporation in shade",
      co2_impact: "~48 lbs CO₂/yr sequestered",
      after_suggestion: "Keep — add native understory plants",
    },
  ],
};
