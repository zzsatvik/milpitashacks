export interface MonthlySeasonalPoint {
  month: number;
  month_label: string;
  water_waste_gal: number;
  heat_index: number;
  water_multiplier: number;
}

export interface SeasonalProjection {
  months: MonthlySeasonalPoint[];
  peak_month: string;
  peak_water_multiplier: number;
  peak_heat_month: string;
  headline: string;
  climate_zone?: string;
}

export interface ZipWaterBenchmark {
  zip_average_monthly_bill_usd: number;
  avg_gallons_per_month: number;
  typical_lawn_share_pct: number;
  utility_name?: string;
}

export interface WaterBillBreakdown {
  user_monthly_bill_usd: number;
  zip_average_bill_usd: number;
  estimated_lawn_share_pct: number;
  wasted_on_landscaping_usd: number;
  avoidable_monthly_usd: number;
  vs_zip_average_usd: number;
  headline: string;
}

export interface SwapRoi {
  zone_id: number;
  swap_label: string;
  upfront_cost_usd: number;
  annual_water_savings_usd: number;
  annual_maintenance_savings_usd: number;
  rebate_usd: number;
  rebate_program?: string;
  break_even_months: number;
  five_year_net_usd: number;
  summary: string;
}

export interface ContractorEstimate {
  zone_id: number;
  diy: {
    materials_usd: number;
    hours: number;
    difficulty: "easy" | "moderate" | "hard";
    summary: string;
    line_items: string[];
  };
  professional: {
    labor_usd: number;
    materials_usd: number;
    total_usd: number;
    timeline: string;
    summary: string;
    line_items: string[];
  };
}

export interface PlantIdentification {
  common_name: string;
  scientific_name?: string;
  confidence: "high" | "medium" | "low";
  invasive_risk: string;
  water_needs: string;
  native_status: string;
  care_notes: string;
  swap_suggestion?: string;
}

export interface AuditInsights {
  seasonal: SeasonalProjection;
  zip_benchmark: ZipWaterBenchmark;
  swap_rois: SwapRoi[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
