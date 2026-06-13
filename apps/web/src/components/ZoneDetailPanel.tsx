import type { LawnZone } from "@terraview/shared";
import { SEVERITY_COLORS } from "@terraview/shared";
import { ActionPlanDetails } from "./ActionPlanDetails";
import { PlantIdPanel } from "./PlantIdPanel";
import { Close, Droplet, Sprout } from "./Icons";

interface ZoneDetailPanelProps {
  zone: LawnZone | null;
  imageUrl: string;
  zipCode: string;
  onClose: () => void;
}

export function ZoneDetailPanel({
  zone,
  imageUrl,
  zipCode,
  onClose,
}: ZoneDetailPanelProps) {
  if (!zone) return null;

  const colors = SEVERITY_COLORS[zone.severity];

  return (
    <div className="animate-fade-up glass rounded-3xl p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-data text-[10px] uppercase tracking-[0.12em]"
            style={{
              borderColor: colors.stroke + "55",
              background: colors.fill,
              color: colors.stroke,
            }}
          >
            {colors.label}
          </span>
          <h3 className="mt-2 font-display text-xl text-forest-50 tracking-tight-display">
            {zone.label}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="glass-subtle inline-flex h-8 w-8 items-center justify-center rounded-full text-forest-100/60 transition hover:border-white/20 hover:text-forest-50"
          aria-label="Close"
        >
          <Close size={14} />
        </button>
      </div>

      <div className="space-y-4 text-sm">
        <Section label="Issue">
          <p className="text-forest-100/75 leading-relaxed">{zone.issue}</p>
        </Section>
        <Section label="Recommendation">
          <p className="text-forest-100/75 leading-relaxed">{zone.recommendation}</p>
        </Section>

        <div className="flex flex-wrap gap-2 pt-1">
          {zone.water_impact && (
            <div className="inline-flex items-center gap-2 rounded-full border border-aurora-cyan/25 bg-aurora-cyan/10 px-3 py-1.5 text-xs text-aurora-cyan">
              <Droplet size={12} strokeWidth={2} />
              {zone.water_impact}
            </div>
          )}
          {zone.co2_impact && (
            <div className="inline-flex items-center gap-2 rounded-full border border-glow-400/25 bg-glow-400/10 px-3 py-1.5 text-xs text-glow-300">
              <Sprout size={12} strokeWidth={2} />
              {zone.co2_impact}
            </div>
          )}
        </div>

        <PlantIdPanel zone={zone} imageUrl={imageUrl} zipCode={zipCode} />

        {zone.action_plan && <ActionPlanDetails plan={zone.action_plan} />}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 font-mono-data text-[10px] uppercase tracking-[0.16em] text-forest-100/40">
        {label}
      </div>
      {children}
    </div>
  );
}
