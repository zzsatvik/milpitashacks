import type { LawnScores, RiskLevel } from "@terraview/shared";
import { Droplet, Sprout, Sun, Recycle, Mountain } from "./Icons";

interface ScorecardProps {
  scores: LawnScores;
  summary: string;
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="glass-subtle h-1.5 overflow-hidden rounded-full">
      <div
        className="score-bar-fill h-full rounded-full"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    high:   "border-red-400/30 bg-red-400/10 text-red-300",
    medium: "border-aurora-amber/30 bg-aurora-amber/10 text-aurora-amber",
    low:    "border-glow-400/30 bg-glow-400/10 text-glow-300",
  };
  const labels: Record<RiskLevel, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-data text-[10px] uppercase tracking-[0.12em] ${styles[level]}`}
    >
      {labels[level]}
    </span>
  );
}

export function Scorecard({ scores, summary }: ScorecardProps) {
  return (
    <aside className="glass-strong sticky top-24 flex flex-col gap-6 rounded-3xl p-6">
      <div>
        <div className="mb-2 flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
          <span className="inline-block h-1 w-1 rounded-full bg-glow-400" />
          Scorecard
        </div>
        <p className="text-sm leading-relaxed text-forest-100/75">{summary}</p>
      </div>

      {/* Overall grade — luminous display */}
      <div className="relative overflow-hidden rounded-2xl border border-glow-400/20 bg-gradient-to-br from-glow-400/10 via-forest-700/20 to-forest-800/30 p-5">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-glow-400/15 blur-2xl" />
        <div className="relative flex items-end justify-between">
          <div>
            <div className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/50">
              Overall
            </div>
            <div className="mt-0.5 text-xs text-forest-100/70">Yard sustainability</div>
          </div>
          <div className="font-display text-6xl font-semibold leading-none text-glow-300 text-glow">
            {scores.overall_grade}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ScoreRow
          icon={<Droplet size={14} strokeWidth={1.8} />}
          color="text-aurora-cyan"
          label="Water efficiency"
          value={`${scores.water_efficiency}/100`}
        >
          <ScoreBar value={scores.water_efficiency} color="#5eead4" />
        </ScoreRow>

        <ScoreRow
          icon={<Sprout size={14} strokeWidth={1.8} />}
          color="text-glow-400"
          label="Biodiversity"
          value={`${scores.biodiversity}/100`}
        >
          <ScoreBar value={scores.biodiversity} color="#a3e635" />
        </ScoreRow>

        <SimpleRow icon={<Sun size={14} strokeWidth={1.8} />} color="text-aurora-amber" label="Heat island risk">
          <RiskBadge level={scores.heat_island_risk} />
        </SimpleRow>

        <SimpleRow icon={<Mountain size={14} strokeWidth={1.8} />} color="text-forest-300" label="Carbon sequestration">
          <RiskBadge level={scores.carbon_sequestration} />
        </SimpleRow>

        <SimpleRow icon={<Recycle size={14} strokeWidth={1.8} />} color="text-aurora-violet" label="Soil health">
          <RiskBadge level={scores.soil_health} />
        </SimpleRow>
      </div>

      {(scores.estimated_water_waste_gal != null ||
        scores.potential_co2_sequestration_lbs != null) && (
        <div className="space-y-2.5 border-t border-white/5 pt-5 text-sm">
          {scores.estimated_water_waste_gal != null && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-forest-100/55">Excess water</span>
              <span className="font-mono-data text-glow-300 tabular">
                ~{scores.estimated_water_waste_gal.toLocaleString()} gal/yr
              </span>
            </div>
          )}
          {scores.potential_co2_sequestration_lbs != null && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-forest-100/55">CO₂ potential</span>
              <span className="font-mono-data text-glow-300 tabular">
                +{scores.potential_co2_sequestration_lbs} lbs/yr
              </span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

function ScoreRow({
  icon,
  color,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-forest-100/80">
          <span className={color}>{icon}</span>
          {label}
        </span>
        <span className="font-mono-data text-xs text-forest-50 tabular">{value}</span>
      </div>
      {children}
    </div>
  );
}

function SimpleRow({
  icon,
  color,
  label,
  children,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-forest-100/80">
        <span className={color}>{icon}</span>
        {label}
      </span>
      {children}
    </div>
  );
}
