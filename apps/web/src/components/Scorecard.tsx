import type { LawnScores, RiskLevel } from "@lawn-audit/shared";

interface ScorecardProps {
  scores: LawnScores;
  summary: string;
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-forest-100">
      <div
        className="score-bar-fill h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-800",
    low: "bg-green-100 text-green-700",
  };
  const labels: Record<RiskLevel, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[level]}`}
    >
      {labels[level]}
    </span>
  );
}

export function Scorecard({ scores, summary }: ScorecardProps) {
  return (
    <aside className="flex flex-col gap-5 rounded-2xl border border-forest-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
      <div>
        <h2 className="font-display text-lg text-forest-900">Scorecard</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-600">{summary}</p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-forest-50 px-4 py-3">
        <span className="text-sm font-medium text-forest-700">
          Overall Grade
        </span>
        <span className="font-display text-3xl font-bold text-forest-800">
          {scores.overall_grade}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-forest-700">💧 Water Efficiency</span>
            <span className="font-semibold text-forest-900">
              {scores.water_efficiency}/100
            </span>
          </div>
          <ScoreBar value={scores.water_efficiency} color="#3b82f6" />
        </div>

        <div>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-forest-700">🌿 Biodiversity</span>
            <span className="font-semibold text-forest-900">
              {scores.biodiversity}/100
            </span>
          </div>
          <ScoreBar value={scores.biodiversity} color="#16a34a" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-forest-700">🌡️ Heat Island Risk</span>
          <RiskBadge level={scores.heat_island_risk} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-forest-700">🌱 Carbon Sequestration</span>
          <RiskBadge level={scores.carbon_sequestration} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-forest-700">♻️ Soil Health</span>
          <RiskBadge level={scores.soil_health} />
        </div>
      </div>

      {(scores.estimated_water_waste_gal != null ||
        scores.potential_co2_sequestration_lbs != null) && (
        <div className="space-y-2 border-t border-forest-100 pt-4 text-sm">
          {scores.estimated_water_waste_gal != null && (
            <p className="text-forest-700">
              <span className="font-medium">Estimated water waste:</span>{" "}
              ~{scores.estimated_water_waste_gal.toLocaleString()} gal/yr above
              optimal
            </p>
          )}
          {scores.potential_co2_sequestration_lbs != null && (
            <p className="text-forest-700">
              <span className="font-medium">CO₂ you could sequester:</span> +
              {scores.potential_co2_sequestration_lbs} lbs/yr with recommended
              changes
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
