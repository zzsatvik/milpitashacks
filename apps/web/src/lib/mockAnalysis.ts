import type { LawnAnalysis, ZoneActionPlan } from "@terraview/shared";

const turfPlan = (zip: string): ZoneActionPlan => ({
  steps: [
    "Mark the turf boundary with spray paint or a hose layout.",
    "Solarize or sheet-mulch with cardboard for 2–4 weeks to kill grass.",
    "Spread 2–3 in. decomposed granite, then plant drought-tolerant natives.",
    "Water deeply once per week for the first month, then switch to drip.",
  ],
  items: [
    {
      name: "Decomposed granite (DG)",
      quantity: "1.5 cu yd",
      purpose: "Replace water-hungry turf with permeable ground cover",
    },
    {
      name: "California poppy seeds or native yarrow plugs",
      quantity: "1 lb seed or 12 plugs",
      purpose: "Low-water color and pollinator habitat",
    },
    {
      name: "Cardboard sheets (untreated)",
      quantity: "enough to cover zone",
      purpose: "Sheet mulch to smother existing turf",
    },
  ],
  where_to_buy: [
    {
      store_name: "Home Depot",
      distance: "~1.8 mi",
      address_hint: `near ZIP ${zip}`,
      notes: "DG in garden center bulk area; poppy seed in seed aisle",
    },
    {
      store_name: "Local native plant nursery",
      distance: "~3–5 mi",
      address_hint: "Search 'native nursery' near your zip",
      notes: "Staff can confirm species for your exact microclimate",
    },
  ],
});

export function buildMockAnalysis(zipCode = "95035"): LawnAnalysis {
  return {
    summary:
      "Your lawn is dominated by water-intensive turf with limited native planting. Hardscape and bare soil patches increase heat retention and erosion risk. Targeted swaps could save thousands of gallons annually while boosting biodiversity.",
    location: {
      zip_code: zipCode,
      region_hint: zipCode.startsWith("950") ? "South Bay / Milpitas area" : "Your region",
      climate_note: "Mediterranean climate — dry summers favor natives and drip irrigation",
    },
    regional_tips: [
      `Check ${zipCode.startsWith("950") ? "Valley Water" : "your local water district"} rebate programs for turf replacement`,
      "Plant in fall or early spring for best establishment before dry season",
      "Prefer UC Davis Arboretum All-Stars or CNPS local native lists",
      "Set irrigation to 2×/week max June–September once established",
    ],
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
        action_plan: turfPlan(zipCode),
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
        action_plan: {
          steps: [
            "Mulch existing bed with 2 in. arborist wood chips.",
            "Add 3–4 Cleveland sage or coyote bush plugs spacing 24 in. apart.",
            "Deep water once weekly for 3 weeks, then monthly.",
          ],
          items: [
            {
              name: "Arborist wood chip mulch",
              quantity: "0.5 cu yd",
              purpose: "Retain moisture and suppress weeds",
            },
            {
              name: "Salvia clevelandii (Cleveland sage) plugs",
              quantity: "4 plants",
              purpose: "Expand native pollinator habitat",
            },
          ],
          where_to_buy: [
            {
              store_name: "Lowe's",
              distance: "~2.2 mi",
              notes: "Mulch in garden center; check native section for sage",
            },
          ],
        },
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
        action_plan: {
          steps: [
            "Loosen compacted soil lightly with a garden fork.",
            "Apply 2–3 in. shredded bark mulch or plant creeping thyme.",
            "If planting, space thyme plugs 6 in. apart and water until rooted.",
          ],
          items: [
            {
              name: "Shredded bark mulch",
              quantity: "3 bags (2 cu ft each)",
              purpose: "Prevent erosion and retain soil moisture",
            },
            {
              name: "Creeping thyme plugs",
              quantity: "6–8 plants",
              purpose: "Living ground cover alternative to mulch",
            },
          ],
          where_to_buy: [
            {
              store_name: "Home Depot",
              distance: "~1.8 mi",
              notes: "Mulch bags in outdoor garden; thyme in herb/perennial section",
            },
            {
              store_name: "Ace Hardware",
              distance: "~2.5 mi",
              notes: "Often stocks ground cover herbs seasonally",
            },
          ],
        },
      },
      {
        id: 4,
        label: "Concrete driveway",
        bbox: { x: 0.02, y: 0.05, width: 0.22, height: 0.88 },
        severity: "moderate",
        issue: "Heat island contributor, zero water absorption",
        recommendation: "Consider permeable pavers or shade trees along edge",
        water_impact: "perm. pavers capture ~200 gal/storm",
        co2_impact: "neutral",
        after_suggestion: "Permeable pavers + shade tree → -4°F surface temp",
        action_plan: {
          steps: [
            "For a full retrofit, consult a hardscape contractor for permeable paver install.",
            "Low-cost interim: plant a shade tree 5 ft from pavement edge on the lawn side.",
            "Use root barrier if planting near hardscape to protect pavement long-term.",
          ],
          items: [
            {
              name: "Coast live oak or valley oak (15 gal)",
              quantity: "1 tree",
              purpose: "Shade hardscape and sequester carbon",
            },
            {
              name: "Root barrier panels",
              quantity: "6 linear ft",
              purpose: "Protect driveway from root lift",
            },
          ],
          where_to_buy: [
            {
              store_name: "SummerWinds Nursery",
              distance: "~4 mi",
              notes: "Better tree selection than big-box; ask for drought-tolerant oak",
            },
          ],
        },
      },
      {
        id: 5,
        label: "Lawn edge / pavement",
        bbox: { x: 0.22, y: 0.72, width: 0.35, height: 0.12 },
        severity: "high",
        issue: "Irrigation runoff likely at hardscape boundary",
        recommendation: "Install buffer strip or rain garden to capture runoff",
        water_impact: "captures ~500 gal per storm event",
        co2_impact: "+15 lbs/yr with plantings",
        after_suggestion: "Add rain garden here → captures 500 gal per storm event",
        action_plan: {
          steps: [
            "Dig a shallow swale 6–8 in. deep along the pavement edge.",
            "Line with river rock at the inlet, plant rushes and sedges in the basin.",
            "Direct downspout or sprinkler overspray into the swale if possible.",
          ],
          items: [
            {
              name: "River rock (3/4 in.)",
              quantity: "0.25 cu yd",
              purpose: "Inlet stabilization for rain garden",
            },
            {
              name: "Juncus or sedge plugs",
              quantity: "8 plants",
              purpose: "Filter runoff and tolerate wet/dry cycles",
            },
            {
              name: "Biodegradable landscape fabric",
              quantity: "1 roll",
              purpose: "Weed barrier under rock",
            },
          ],
          where_to_buy: [
            {
              store_name: "Home Depot",
              distance: "~1.8 mi",
              notes: "River rock in hardscape; sedges in pond/rain garden section",
            },
          ],
        },
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
        action_plan: {
          steps: [
            "Clear grass within the dripline; do not pile mulch against trunk.",
            "Plant native understory (yarrow, coral bells) in partial shade.",
            "Deep water tree monthly in dry season if established tree shows stress.",
          ],
          items: [
            {
              name: "Organic slow-release tree fertilizer (low-N)",
              quantity: "1 bag",
              purpose: "Annual spring feeding if soil test indicates need",
            },
            {
              name: "Heuchera (coral bells) or native yarrow",
              quantity: "4 plants",
              purpose: "Understory biodiversity under existing tree",
            },
          ],
          where_to_buy: [
            {
              store_name: "Lowe's",
              distance: "~2.2 mi",
              notes: "Fertilizer in garden; perennials in shade section",
            },
          ],
        },
      },
    ],
  };
}

/** @deprecated use buildMockAnalysis */
export const MOCK_ANALYSIS = buildMockAnalysis("95035");
