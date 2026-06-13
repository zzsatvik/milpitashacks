import { useState } from "react";
import type { LawnZone } from "@lawn-audit/shared";
import { SEVERITY_COLORS } from "@lawn-audit/shared";
import { ActionPlanDetails } from "./ActionPlanDetails";
import { ChevronRight, Droplet, Sprout } from "./Icons";

interface SwapSuggestionsListProps {
  zones: LawnZone[];
  selectedZoneId: number | null;
  onZoneSelect: (zoneId: number | null) => void;
}

export function SwapSuggestionsList({
  zones,
  selectedZoneId,
  onZoneSelect,
}: SwapSuggestionsListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const sorted = [...zones].sort((a, b) => a.id - b.id);

  const toggleExpanded = (zoneId: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(zoneId)) next.delete(zoneId);
      else next.add(zoneId);
      return next;
    });
  };

  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-1 flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
        <span className="inline-block h-1 w-1 rounded-full bg-glow-400" />
        Recommended swaps
      </div>
      <h3 className="font-display text-xl text-forest-50">
        Make these moves first
      </h3>
      <p className="mt-1 text-sm text-forest-100/55">
        Expand any row for shopping list, stores, and step-by-step instructions
      </p>

      <ol className="mt-5 space-y-2.5">
        {sorted.map((zone, index) => {
          const num = index + 1;
          const isSelected = zone.id === selectedZoneId;
          const isExpanded = expandedIds.has(zone.id);
          const suggestion = zone.after_suggestion ?? zone.recommendation;
          const hasPlan = Boolean(zone.action_plan);

          return (
            <li key={zone.id}>
              <div
                className={`
                  rounded-2xl border transition-all
                  ${isSelected
                    ? "border-glow-400/35 bg-glow-400/5 [box-shadow:0_0_0_4px_rgba(163,230,53,0.05),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                    : "border-white/[0.06] bg-white/[0.02]"
                  }
                `}
              >
                <div className="flex gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => onZoneSelect(isSelected ? null : zone.id)}
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-display text-sm font-semibold transition
                      ${isSelected
                        ? "border-glow-400/40 bg-glow-400 text-forest-950"
                        : "border-white/10 bg-white/5 text-forest-100/80 hover:border-glow-400/30 hover:text-glow-300"
                      }
                    `}
                    aria-label={`Highlight zone ${num} on photo`}
                  >
                    {num}
                  </button>

                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onZoneSelect(isSelected ? null : zone.id)}
                      className="w-full text-left"
                    >
                      <p className="font-display text-[1.05rem] leading-snug text-forest-50">
                        {zone.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-forest-100/65">
                        {suggestion}
                      </p>
                    </button>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.1em]">
                      {zone.water_impact && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-aurora-cyan/25 bg-aurora-cyan/8 px-2 py-0.5 text-aurora-cyan">
                          <Droplet size={10} strokeWidth={2} />
                          {zone.water_impact}
                        </span>
                      )}
                      {zone.co2_impact && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-glow-400/25 bg-glow-400/8 px-2 py-0.5 text-glow-300">
                          <Sprout size={10} strokeWidth={2} />
                          {zone.co2_impact}
                        </span>
                      )}
                      <span
                        className="rounded-full border px-2 py-0.5"
                        style={{
                          borderColor: SEVERITY_COLORS[zone.severity].stroke + "55",
                          background: SEVERITY_COLORS[zone.severity].fill,
                          color: SEVERITY_COLORS[zone.severity].stroke,
                        }}
                      >
                        {SEVERITY_COLORS[zone.severity].label}
                      </span>
                    </div>

                    {hasPlan && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(zone.id)}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-glow-300 transition hover:text-glow-400"
                        aria-expanded={isExpanded}
                      >
                        <ChevronRight
                          size={14}
                          strokeWidth={2}
                          className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                        {isExpanded ? "Hide details" : "View shopping list & steps"}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && zone.action_plan && (
                  <div className="border-t border-white/6 px-4 pb-4 pt-0">
                    <ActionPlanDetails plan={zone.action_plan} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
