import type { LawnZone } from "@lawn-audit/shared";
import { SEVERITY_COLORS } from "@lawn-audit/shared";

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
  const sorted = [...zones].sort((a, b) => a.id - b.id);

  return (
    <div className="rounded-2xl border border-forest-200 bg-white p-5 shadow-sm">
      <h3 className="font-display text-lg text-forest-900">
        Suggested Swaps
      </h3>
      <p className="mt-1 text-sm text-forest-600">
        Match the numbered zones on the photo above
      </p>

      <ol className="mt-4 space-y-3">
        {sorted.map((zone, index) => {
          const num = index + 1;
          const isSelected = zone.id === selectedZoneId;
          const suggestion =
            zone.after_suggestion ?? zone.recommendation;

          return (
            <li key={zone.id}>
              <button
                type="button"
                onClick={() =>
                  onZoneSelect(isSelected ? null : zone.id)
                }
                className={`
                  flex w-full gap-4 rounded-xl border p-4 text-left transition
                  ${isSelected
                    ? "border-forest-500 bg-forest-50 shadow-sm"
                    : "border-forest-100 bg-forest-50/40 hover:border-forest-300 hover:bg-forest-50"
                  }
                `}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white"
                >
                  {num}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-forest-900">{zone.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-forest-700">
                    {suggestion}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {zone.water_impact && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-blue-800">
                        💧 {zone.water_impact}
                      </span>
                    )}
                    {zone.co2_impact && (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-green-800">
                        🌱 {zone.co2_impact}
                      </span>
                    )}
                    <span
                      className="rounded-full px-2.5 py-0.5 font-medium"
                      style={{
                        backgroundColor:
                          SEVERITY_COLORS[zone.severity].fill,
                        color: SEVERITY_COLORS[zone.severity].stroke,
                      }}
                    >
                      {SEVERITY_COLORS[zone.severity].label}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
