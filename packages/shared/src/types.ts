export type Severity = "high" | "moderate" | "good";

export type RiskLevel = "high" | "medium" | "low";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PurchaseItem {
  name: string;
  quantity?: string;
  purpose: string;
}

export interface StoreOption {
  store_name: string;
  distance?: string;
  address_hint?: string;
  notes?: string;
  maps_url?: string;
  place_id?: string;
}

export interface ZoneActionPlan {
  steps: string[];
  items: PurchaseItem[];
  where_to_buy: StoreOption[];
}

export interface LawnZone {
  id: number;
  label: string;
  bbox: BoundingBox;
  severity: Severity;
  issue: string;
  recommendation: string;
  water_impact?: string;
  co2_impact?: string;
  after_suggestion?: string;
  action_plan?: ZoneActionPlan;
}

export interface LawnScores {
  water_efficiency: number;
  biodiversity: number;
  heat_island_risk: RiskLevel;
  carbon_sequestration: RiskLevel;
  soil_health: RiskLevel;
  overall_grade: string;
  estimated_water_waste_gal?: number;
  potential_co2_sequestration_lbs?: number;
}

export interface LawnLocationContext {
  zip_code: string;
  region_hint?: string;
  climate_note?: string;
}

export interface LawnAnalysis {
  zones: LawnZone[];
  scores: LawnScores;
  summary: string;
  location?: LawnLocationContext;
  regional_tips?: string[];
}

export const SEVERITY_COLORS: Record<
  Severity,
  { stroke: string; fill: string; label: string }
> = {
  high: { stroke: "#dc2626", fill: "rgba(220, 38, 38, 0.15)", label: "Urgent" },
  moderate: {
    stroke: "#ca8a04",
    fill: "rgba(202, 138, 4, 0.15)",
    label: "Moderate",
  },
  good: { stroke: "#16a34a", fill: "rgba(22, 163, 74, 0.15)", label: "Good" },
};
