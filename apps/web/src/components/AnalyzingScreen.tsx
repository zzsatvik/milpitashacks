import { useEffect, useState } from "react";

const STEPS = [
  { label: "Scanning yard zones", detail: "Mapping turf, beds, and hardscape…" },
  { label: "Identifying plant types", detail: "Native vs. water-intensive species…" },
  { label: "Calculating water footprint", detail: "Estimating irrigation demand…" },
  { label: "Estimating carbon impact", detail: "Sequestration & heat island risk…" },
  { label: "Building recommendations", detail: "Drafting personalized swaps…" },
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
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-6 py-12">
      {/* Photo preview with scan effect */}
      {imageUrl && (
        <div className="relative mb-10 w-full max-w-md overflow-hidden rounded-2xl border-2 border-forest-200 shadow-lg">
          <img
            src={imageUrl}
            alt="Your yard"
            className="block h-48 w-full object-cover opacity-90"
          />
          <div className="pointer-events-none absolute inset-0 bg-forest-900/20" />
          <div className="scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-forest-300 to-transparent shadow-[0_0_20px_rgba(107,168,118,0.8)]" />
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-30">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-forest-300/40" />
            ))}
          </div>
        </div>
      )}

      {/* Orb loader */}
      <div className="relative mb-6 h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-forest-100" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-forest-500 border-r-forest-400 loader-spin"
        />
        <span className="absolute inset-0 flex items-center justify-center text-2xl">
          🌿
        </span>
      </div>

      <h2 className="font-display text-2xl text-forest-900">
        Analyzing your lawn…
      </h2>
      <p className="mt-2 max-w-sm text-center text-sm text-forest-600">
        {STEPS[activeStep]?.detail}
      </p>

      {/* Progress bar */}
      <div className="mt-8 w-full max-w-md">
        <div className="mb-2 flex justify-between text-xs font-medium text-forest-600">
          <span>{STEPS[activeStep]?.label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-forest-100">
          <div
            className="analyze-progress-fill h-full rounded-full bg-gradient-to-r from-forest-400 via-forest-500 to-forest-600"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step pills */}
      <ul className="mt-8 flex w-full max-w-md flex-col gap-2">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const current = i === activeStep;
          return (
            <li
              key={step.label}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300
                ${current ? "bg-forest-100 text-forest-900" : done ? "text-forest-600" : "text-forest-400"}
              `}
            >
              <span
                className={`
                  flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold
                  ${done ? "bg-forest-500 text-white" : current ? "bg-forest-600 text-white loader-pulse-dot" : "bg-forest-200 text-forest-500"}
                `}
              >
                {done ? "✓" : i + 1}
              </span>
              {step.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
