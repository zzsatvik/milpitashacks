import { useState } from "react";
import type { LawnZone, PlantIdentification } from "@terraview/shared";
import { cropZoneFromImage } from "../lib/cropZoneImage";
import { fetchPlantIdentification } from "../lib/auditFeatures";
import { useMockMode } from "../lib/env";
import { mockPlantIdentification } from "../lib/mockFeatures";
import { Scanner, Sprout } from "./Icons";

interface PlantIdPanelProps {
  zone: LawnZone;
  imageUrl: string;
  zipCode: string;
}

export function PlantIdPanel({ zone, imageUrl, zipCode }: PlantIdPanelProps) {
  const USE_MOCK = useMockMode();
  const [result, setResult] = useState<PlantIdentification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropPreview, setCropPreview] = useState<string | null>(null);

  const identify = async () => {
    setLoading(true);
    setError(null);
    try {
      const crop = await cropZoneFromImage(imageUrl, zone.bbox);
      setCropPreview(crop);
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 900));
        setResult(mockPlantIdentification(zone));
      } else {
        setResult(await fetchPlantIdentification(crop, zone, zipCode));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Identification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-white/8 pt-4 mt-4">
      <div className="flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/45">
        <Scanner size={11} strokeWidth={2} className="text-glow-400" />
        Plant ID mode
      </div>

      {!result ? (
        <button
          type="button"
          onClick={identify}
          disabled={loading}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-glow-400/25 bg-glow-400/8 px-4 py-2.5 text-sm font-medium text-glow-300 transition hover:border-glow-400/40 disabled:opacity-50"
        >
          <Sprout size={14} strokeWidth={2} />
          {loading ? "Analyzing this zone…" : "What plant is this?"}
        </button>
      ) : (
        <div className="mt-3 animate-fade-in space-y-3">
          {cropPreview && (
            <img
              src={cropPreview}
              alt={`Crop of ${zone.label}`}
              className="h-24 w-full rounded-xl object-cover opacity-90"
            />
          )}
          <div>
            <p className="font-display text-lg text-forest-50">{result.common_name}</p>
            {result.scientific_name && (
              <p className="text-sm italic text-forest-100/50">{result.scientific_name}</p>
            )}
            <span className="mt-1 inline-block rounded-full border border-white/10 px-2 py-0.5 font-mono-data text-[9px] uppercase text-forest-100/45">
              {result.confidence} confidence
            </span>
          </div>
          <InfoRow label="Water needs" value={result.water_needs} />
          <InfoRow label="Native status" value={result.native_status} />
          <InfoRow label="Invasive risk" value={result.invasive_risk} />
          <p className="text-sm leading-relaxed text-forest-100/65">{result.care_notes}</p>
          {result.swap_suggestion && (
            <p className="rounded-xl border border-glow-400/20 bg-glow-400/5 px-3 py-2 text-sm text-glow-300">
              Swap idea: {result.swap_suggestion}
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setCropPreview(null);
            }}
            className="text-xs text-forest-100/40 hover:text-forest-100/70"
          >
            Identify again
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="shrink-0 font-mono-data text-[10px] uppercase tracking-wider text-forest-100/40">
        {label}:
      </span>
      <span className="text-forest-100/70">{value}</span>
    </div>
  );
}
