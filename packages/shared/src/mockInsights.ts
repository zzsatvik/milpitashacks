import type { AuditInsights } from "./insights-types";
import type { LawnAnalysis } from "./types";

export function buildMockInsights(
  analysis: LawnAnalysis,
  zipCode = "95035",
): AuditInsights {
  const baseMonthly = Math.round(
    (analysis.scores.estimated_water_waste_gal ?? 7200) / 12,
  );

  const multipliers = [0.35, 0.4, 0.55, 0.75, 1.0, 1.45, 1.85, 2.1, 1.6, 0.9, 0.5, 0.38];
  const heatIndices = [22, 25, 35, 48, 62, 78, 88, 92, 75, 55, 38, 26];
  const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const months = multipliers.map((mult, i) => ({
    month: i + 1,
    month_label: labels[i]!,
    water_waste_gal: Math.round(baseMonthly * mult),
    heat_index: heatIndices[i]!,
    water_multiplier: Math.round(mult * 100) / 100,
  }));

  const peak = months.reduce((a, b) =>
    a.water_waste_gal > b.water_waste_gal ? a : b,
  );
  const peakHeat = months.reduce((a, b) =>
    a.heat_index > b.heat_index ? a : b,
  );

  const swapZones = analysis.zones.filter(
    (z) => z.severity === "high" || z.severity === "moderate",
  );

  const swap_rois = swapZones.map((z, i) => {
    const upfront = [420, 680, 290, 550][i % 4] ?? 400;
    const waterSave = [186, 240, 120, 200][i % 4] ?? 150;
    const maintSave = [60, 40, 80, 50][i % 4] ?? 50;
    const rebate = zipCode.startsWith("950") ? 300 : 150;
    const annual = waterSave + maintSave;
    const breakEven = Math.max(1, Math.round(upfront / (annual / 12)));
    return {
      zone_id: z.id,
      swap_label: z.after_suggestion ?? z.recommendation,
      upfront_cost_usd: upfront,
      annual_water_savings_usd: waterSave,
      annual_maintenance_savings_usd: maintSave,
      rebate_usd: rebate,
      rebate_program: zipCode.startsWith("950")
        ? "Valley Water Landscape Rebate"
        : "Local water district rebate (check availability)",
      break_even_months: breakEven,
      five_year_net_usd: annual * 5 + rebate - upfront,
      summary: `Pays for itself in ~${breakEven} months; +$${annual * 5 + rebate - upfront} over 5 years.`,
    };
  });

  return {
    seasonal: {
      months,
      peak_month: peak.month_label,
      peak_water_multiplier: peak.water_multiplier,
      peak_heat_month: peakHeat.month_label,
      headline: `In ${peak.month_label}, this yard wastes ${peak.water_multiplier}x more water than in ${months.reduce((a, b) => (a.water_multiplier < b.water_multiplier ? a : b)).month_label}.`,
      climate_zone: zipCode.startsWith("950")
        ? "Mediterranean (dry summers)"
        : "Regional temperate",
    },
    zip_benchmark: {
      zip_average_monthly_bill_usd: zipCode.startsWith("950") ? 142 : 118,
      avg_gallons_per_month: zipCode.startsWith("950") ? 8900 : 7200,
      typical_lawn_share_pct: 42,
      utility_name: zipCode.startsWith("950") ? "Valley Water" : "Local municipal utility",
    },
    swap_rois,
  };
}
