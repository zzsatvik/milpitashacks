import { useEffect, useState } from "react";
import { Check } from "./Icons";

const STEPS = [
  { label: "Scanning yard zones",        detail: "Mapping turf, beds, and hardscape" },
  { label: "Identifying plant types",    detail: "Native vs. water-intensive species" },
  { label: "Calculating water footprint", detail: "Estimating irrigation demand" },
  { label: "Estimating carbon impact",   detail: "Sequestration & heat island risk" },
  { label: "Building recommendations",   detail: "Drafting personalized swaps" },
  { label: "Seasonal projections",     detail: "Modeling water waste & heat by month" },
];

interface AnalyzingScreenProps {
  imageUrl?: string | null;
}

export function AnalyzingScreen({ imageUrl }: AnalyzingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        const bump = p < 40 ? 2.2 : p < 70 ? 1.1 : 0.35;
        return Math.min(p + bump, 92);
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepIndex = Math.min(
      Math.floor(progress / (100 / STEPS.length)),
      STEPS.length - 1,
    );
    setActiveStep(stepIndex);
  }, [progress]);

  return (
    <div className="animate-fade-in flex min-h-[70vh] flex-col items-center justify-center px-6 py-12">
      {/* Photo preview with scan effect */}
      {imageUrl && (
        <div className="glass relative mb-10 w-full max-w-md overflow-hidden rounded-3xl p-2">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={imageUrl}
              alt="Your yard"
              className="block h-52 w-full object-cover opacity-85"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-950/30 via-transparent to-forest-950/40" />
            <div className="scan-line absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-glow-400 to-transparent shadow-[0_0_20px_rgba(163,230,53,0.9)]" />
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-5 opacity-30">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="border border-glow-400/12" />
              ))}
            </div>
            {/* corner brackets */}
            <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-glow-400/70" />
            <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-glow-400/70" />
            <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-glow-400/70" />
            <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-glow-400/70" />
          </div>
        </div>
      )}

      {/* Concentric orb loader */}
      <div className="relative mb-8 h-24 w-24">
        <div className="absolute inset-0 rounded-full border border-glow-400/15" />
        <div className="absolute inset-2 rounded-full border border-glow-400/20" />
        <div className="absolute inset-4 rounded-full border border-glow-400/25" />
        <div className="loader-spin absolute inset-0 rounded-full border-2 border-transparent border-t-glow-400 border-r-glow-300/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-glow-400" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-glow-300" />
          </span>
        </div>
      </div>

      <h2 className="font-display text-3xl text-forest-50 tracking-tight-display">
        Reading your yard
      </h2>
      <p className="mt-2 max-w-sm text-center text-sm text-forest-100/55">
        {STEPS[activeStep]?.detail}
      </p>

      {/* Progress bar */}
      <div className="mt-9 w-full max-w-md">
        <div className="mb-2 flex justify-between font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/55">
          <span>{STEPS[activeStep]?.label}</span>
          <span className="tabular text-glow-300">{Math.round(progress)}%</span>
        </div>
        <div className="glass-subtle h-1.5 overflow-hidden rounded-full">
          <div
            className="analyze-progress-fill h-full rounded-full bg-gradient-to-r from-glow-500 via-glow-400 to-glow-300"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 12px rgba(163, 230, 53, 0.5)",
            }}
          />
        </div>
      </div>

      {/* Step pills */}
      <ul className="mt-9 flex w-full max-w-md flex-col gap-1.5">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const current = i === activeStep;
          return (
            <li
              key={step.label}
              className={`
                flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all duration-300
                ${current
                  ? "border-glow-400/25 bg-glow-400/8 text-forest-50"
                  : done
                    ? "border-white/5 text-forest-100/55"
                    : "border-white/5 text-forest-100/30"
                }
              `}
            >
              <span
                className={`
                  flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold
                  ${done
                    ? "bg-glow-400 text-forest-950"
                    : current
                      ? "bg-glow-400 text-forest-950 loader-pulse-dot"
                      : "border border-white/10 bg-white/5 text-forest-100/40"
                  }
                `}
              >
                {done ? <Check size={12} strokeWidth={3} /> : <span className="font-mono-data">{i + 1}</span>}
              </span>
              <span className="font-mono-data text-[12px] uppercase tracking-[0.08em]">{step.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
