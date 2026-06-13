import { useMemo, useState } from "react";
import type { LawnAnalysis, ZipWaterBenchmark } from "@terraview/shared";
import { computeWaterBillBreakdown } from "@terraview/shared";
import { Droplet } from "./Icons";

const BILL_STORAGE_KEY = "terraview-water-bill";

interface WaterBillEstimatorProps {
  analysis: LawnAnalysis;
  benchmark: ZipWaterBenchmark;
}

export function WaterBillEstimator({ analysis, benchmark }: WaterBillEstimatorProps) {
  const [billInput, setBillInput] = useState(() => {
    try {
      return localStorage.getItem(BILL_STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });

  const monthlyBill = parseFloat(billInput);
  const valid = !Number.isNaN(monthlyBill) && monthlyBill > 0;

  const breakdown = useMemo(() => {
    if (!valid) return null;
    return computeWaterBillBreakdown(analysis, monthlyBill, benchmark);
  }, [analysis, monthlyBill, benchmark, valid]);

  const handleChange = (value: string) => {
    setBillInput(value);
    try {
      if (value) localStorage.setItem(BILL_STORAGE_KEY, value);
      else localStorage.removeItem(BILL_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-1 flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
        <Droplet size={11} strokeWidth={2} className="text-aurora-cyan" />
        Water bill estimator
      </div>
      <h3 className="font-display text-xl text-forest-50">
        What inefficient landscaping costs you
      </h3>
      <p className="mt-1 text-sm text-forest-100/55">
        {benchmark.utility_name ?? "Local utility"} avg in your ZIP:{" "}
        <span className="text-forest-100/80">
          ${benchmark.zip_average_monthly_bill_usd}/mo
        </span>
      </p>

      <label className="mt-5 block">
        <span className="font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/45">
          Your monthly water bill ($)
        </span>
        <input
          type="number"
          min="1"
          step="1"
          placeholder="e.g. 185"
          value={billInput}
          onChange={(e) => handleChange(e.target.value)}
          className="glass-subtle mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-lg font-display text-forest-50 outline-none transition focus:border-glow-400/35"
        />
      </label>

      {breakdown ? (
        <div className="mt-5 space-y-4 animate-fade-in">
          <p className="text-sm font-medium leading-relaxed text-glow-300">
            {breakdown.headline}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Lawn share of bill"
              value={`${breakdown.estimated_lawn_share_pct}%`}
              sub={`~$${breakdown.wasted_on_landscaping_usd}/mo outdoors`}
            />
            <StatCard
              label="Avoidable waste"
              value={`$${breakdown.avoidable_monthly_usd}`}
              sub="per month"
              highlight
            />
            <StatCard
              label="vs ZIP average"
              value={`${breakdown.vs_zip_average_usd >= 0 ? "+" : ""}$${breakdown.vs_zip_average_usd}`}
              sub="compared to neighbors"
            />
            <StatCard
              label="Annual savings potential"
              value={`$${(breakdown.avoidable_monthly_usd * 12).toLocaleString()}`}
              sub="if you implement swaps"
            />
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-forest-100/45">
          Enter your bill to see how much goes to inefficient landscaping.
        </p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-3 ${highlight ? "border-glow-400/25 bg-glow-400/8" : "border-white/6 bg-white/[0.02]"}`}
    >
      <div className="font-mono-data text-[9px] uppercase tracking-[0.12em] text-forest-100/40">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-2xl ${highlight ? "text-glow-300" : "text-forest-50"}`}
      >
        {value}
      </div>
      <div className="text-xs text-forest-100/45">{sub}</div>
    </div>
  );
}
