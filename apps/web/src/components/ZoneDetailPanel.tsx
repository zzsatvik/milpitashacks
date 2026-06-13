import type { LawnZone } from "@lawn-audit/shared";
import { SEVERITY_COLORS } from "@lawn-audit/shared";

interface ZoneDetailPanelProps {
  zone: LawnZone | null;
  onClose: () => void;
}

export function ZoneDetailPanel({ zone, onClose }: ZoneDetailPanelProps) {
  if (!zone) return null;

  const colors = SEVERITY_COLORS[zone.severity];

  return (
    <div className="animate-fade-up rounded-2xl border border-forest-200 bg-white p-5 shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span
            className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: colors.fill, color: colors.stroke }}
          >
            {colors.label}
          </span>
          <h3 className="mt-1 font-display text-lg text-forest-900">
            {zone.label}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-forest-400 transition hover:bg-forest-50 hover:text-forest-700"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-forest-800">Issue</p>
          <p className="text-forest-600">{zone.issue}</p>
        </div>
        <div>
          <p className="font-medium text-forest-800">Recommendation</p>
          <p className="text-forest-600">{zone.recommendation}</p>
        </div>
        {zone.water_impact && (
          <div className="rounded-lg bg-blue-50 px-3 py-2 text-blue-800">
            💧 {zone.water_impact}
          </div>
        )}
        {zone.co2_impact && (
          <div className="rounded-lg bg-green-50 px-3 py-2 text-green-800">
            🌱 {zone.co2_impact}
          </div>
        )}
      </div>
    </div>
  );
}
