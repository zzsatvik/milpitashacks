export type Severity = "high" | "moderate" | "good";

export type RiskLevel = "high" | "medium" | "low";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
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

export interface LawnAnalysis {
  zones: LawnZone[];
  scores: LawnScores;
  summary: string;
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
