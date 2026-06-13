import type { SeasonalProjection } from "@terraview/shared";
import { Droplet, Sun } from "./Icons";

interface SeasonalProjectionChartProps {
  projection: SeasonalProjection;
}

export function SeasonalProjectionChart({ projection }: SeasonalProjectionChartProps) {
  const maxWater = Math.max(...projection.months.map((m) => m.water_waste_gal), 1);
  const maxHeat = Math.max(...projection.months.map((m) => m.heat_index), 1);

  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-1 flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
        <Sun size={11} strokeWidth={2} className="text-aurora-amber" />
        Seasonal projection
      </div>
      <h3 className="font-display text-xl text-forest-50">
        How your yard changes through the year
      </h3>
      {projection.climate_zone && (
        <p className="mt-1 text-xs text-forest-100/45">{projection.climate_zone}</p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-glow-300">{projection.headline}</p>

      <div className="mt-6 space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-aurora-cyan">
            <Droplet size={12} strokeWidth={2} />
            Monthly water waste (gal)
          </div>
          <div className="flex items-end gap-1 sm:gap-1.5" style={{ height: 120 }}>
            {projection.months.map((m) => {
              const h = Math.max(4, (m.water_waste_gal / maxWater) * 100);
              const isPeak = m.month_label === projection.peak_month;
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono-data text-[9px] tabular text-forest-100/35">
                    {m.water_multiplier > 1 ? `${m.water_multiplier}x` : ""}
                  </span>
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: isPeak
                        ? "linear-gradient(180deg, #5eead4, #0891b2)"
                        : "linear-gradient(180deg, rgba(94,234,212,0.5), rgba(8,145,178,0.35))",
                      boxShadow: isPeak ? "0 0 12px rgba(94,234,212,0.4)" : undefined,
                    }}
                    title={`${m.water_waste_gal.toLocaleString()} gal`}
                  />
                  <span
                    className={`font-mono-data text-[9px] uppercase tracking-wide ${isPeak ? "text-aurora-cyan" : "text-forest-100/40"}`}
                  >
                    {m.month_label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-aurora-amber">
            <Sun size={12} strokeWidth={2} />
            Heat island stress index
          </div>
          <div className="flex items-end gap-1 sm:gap-1.5" style={{ height: 80 }}>
            {projection.months.map((m) => {
              const h = Math.max(4, (m.heat_index / maxHeat) * 100);
              const isPeak = m.month_label === projection.peak_heat_month;
              return (
                <div key={`heat-${m.month}`} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: isPeak
                        ? "linear-gradient(180deg, #fbbf24, #dc2626)"
                        : "linear-gradient(180deg, rgba(251,191,36,0.45), rgba(220,38,38,0.25))",
                    }}
                    title={`Heat index ${m.heat_index}`}
                  />
                  <span className="font-mono-data text-[9px] text-forest-100/30">
                    {m.month_label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
