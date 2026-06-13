import type { SwapRoi } from "@terraview/shared";

interface SwapRoiCardProps {
  roi: SwapRoi;
}

export function SwapRoiCard({ roi }: SwapRoiCardProps) {
  const positive = roi.five_year_net_usd >= 0;

  return (
    <div className="mt-3 rounded-xl border border-glow-400/15 bg-glow-400/5 p-3">
      <div className="flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.14em] text-glow-300">
        5-year ROI
      </div>
      <p className="mt-1 text-sm text-forest-100/70">{roi.summary}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniStat label="Upfront" value={`$${roi.upfront_cost_usd}`} />
        <MiniStat
          label="Annual save"
          value={`$${roi.annual_water_savings_usd + roi.annual_maintenance_savings_usd}`}
        />
        <MiniStat label="Rebate" value={`$${roi.rebate_usd}`} />
        <MiniStat
          label="Break-even"
          value={`${roi.break_even_months} mo`}
          highlight
        />
      </div>
      {roi.rebate_program && (
        <p className="mt-2 text-xs text-forest-100/50">
          Rebate: {roi.rebate_program}
        </p>
      )}
      <div
        className={`mt-2 font-display text-lg ${positive ? "text-glow-300" : "text-aurora-amber"}`}
      >
        5-yr net: {positive ? "+" : ""}${roi.five_year_net_usd.toLocaleString()}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/6 bg-white/[0.02] px-2 py-1.5">
      <div className="font-mono-data text-[8px] uppercase tracking-wider text-forest-100/35">
        {label}
      </div>
      <div className={`text-sm font-medium ${highlight ? "text-glow-300" : "text-forest-50"}`}>
        {value}
      </div>
    </div>
  );
}
