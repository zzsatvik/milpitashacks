import { useEffect, useState } from "react";
import { Compass } from "./Icons";
import {
  getStoredZipCode,
  isValidZipCode,
  normalizeZipCode,
  setStoredZipCode,
} from "../lib/location";

interface ZipCodeFieldProps {
  value: string;
  onChange: (zip: string) => void;
  required?: boolean;
}

export function ZipCodeField({ value, onChange, required }: ZipCodeFieldProps) {
  const [touched, setTouched] = useState(false);
  const invalid = touched && value.length > 0 && !isValidZipCode(value);
  const valid = value.length > 0 && isValidZipCode(value);

  useEffect(() => {
    const stored = getStoredZipCode();
    if (stored) onChange(stored);
    // load saved zip once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glow-400/20 bg-glow-400/8 text-glow-300">
          <Compass size={18} strokeWidth={1.6} />
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor="zip-code" className="font-display text-lg text-forest-50">
            Your ZIP code
          </label>
          <p className="mt-0.5 text-sm text-forest-100/55">
            Powers local plant picks, store suggestions, and regional tips
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              id="zip-code"
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="95035"
              value={value}
              required={required}
              onBlur={() => setTouched(true)}
              onChange={(e) => {
                const next = e.target.value.replace(/[^\d-]/g, "");
                onChange(next);
                if (isValidZipCode(next)) {
                  setStoredZipCode(normalizeZipCode(next));
                }
              }}
              className={`input-glass w-full max-w-[140px] rounded-xl px-3 py-2.5 font-mono-data text-sm tabular ${
                invalid ? "border-red-400/40" : valid ? "border-glow-400/30" : ""
              }`}
            />
            {valid && (
              <span className="font-mono-data text-[10px] uppercase tracking-[0.12em] text-glow-300">
                Location enabled
              </span>
            )}
          </div>
          {invalid && (
            <p className="mt-2 text-xs text-red-300">Enter a valid 5-digit US ZIP code</p>
          )}
        </div>
      </div>
    </div>
  );
}
