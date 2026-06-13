import { useEffect, useRef, useState } from "react";
import { ArrowRight, Layers, Droplet, Sprout, Sun, Sparkles } from "./Icons";

interface HeroProps {
  onUploadClick: () => void;
  onTryDemo: () => void;
}

interface DetectedZone {
  id: number;
  x: number;       // percent
  y: number;       // percent
  w: number;       // percent
  h: number;       // percent
  label: string;
  severity: "high" | "moderate" | "good";
  metric: string;
}

const DEMO_ZONES: DetectedZone[] = [
  { id: 1, x: 8,  y: 12, w: 36, h: 28, label: "Turf grass",      severity: "high",     metric: "63% water draw" },
  { id: 2, x: 50, y: 8,  w: 30, h: 22, label: "Bare soil",       severity: "high",     metric: "erosion risk" },
  { id: 3, x: 12, y: 50, w: 28, h: 30, label: "Hardscape",       severity: "moderate", metric: "+4°F heat" },
  { id: 4, x: 56, y: 46, w: 36, h: 36, label: "Native bed",      severity: "good",     metric: "pollinator zone" },
];

const SEVERITY = {
  high:     { ring: "rgba(248, 113, 113, 0.95)", fill: "rgba(248, 113, 113, 0.10)" },
  moderate: { ring: "rgba(252, 211, 77, 0.95)",  fill: "rgba(252, 211, 77, 0.10)" },
  good:     { ring: "rgba(163, 230, 53, 0.95)",  fill: "rgba(163, 230, 53, 0.12)" },
};

export function Hero({ onUploadClick, onTryDemo }: HeroProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 50, y: 50, active: false });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPointer({ x, y, active: true });

      // tilt for parallax cards
      const rx = ((y - 50) / 50) * -4;
      const ry = ((x - 50) / 50) * 6;
      setTilt({ rx, ry });
    };

    const onLeave = () => {
      setPointer((p) => ({ ...p, active: false }));
      setTilt({ rx: 0, ry: 0 });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const insideZone = (z: DetectedZone) =>
    pointer.x >= z.x && pointer.x <= z.x + z.w &&
    pointer.y >= z.y && pointer.y <= z.y + z.h;

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        {/* LEFT — copy + CTAs */}
        <div className="relative">
          <div className="glass-subtle mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-forest-100/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-glow-400 opacity-80" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-glow-400" />
            </span>
            <span className="font-mono-data uppercase tracking-[0.18em]">
              Vision&nbsp;·&nbsp;Live
            </span>
          </div>

          <h1 className="font-display tracking-tight-display text-balance text-[2.6rem] leading-[1.02] text-forest-50 sm:text-[3.4rem] md:text-[4.1rem]">
            See the&nbsp;
            <em className="font-display italic text-glow text-glow-400">hidden</em>
            <br />
            <span className="text-forest-100">cost of your</span>{" "}
            <span className="relative inline-block">
              <span className="relative z-10">lawn.</span>
              <svg
                className="absolute -bottom-2 left-0 z-0 h-3 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8 Q 50 1, 100 6 T 197 5"
                  stroke="rgba(163, 230, 53, 0.55)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-balance text-[1.05rem] leading-relaxed text-forest-100/70">
            One photo. Our vision model maps every zone, scores water and
            biodiversity, and prescribes the swaps that move the needle the most.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onUploadClick}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-glow-400 px-6 py-3.5 text-sm font-semibold text-forest-950 shadow-[0_8px_32px_-4px_rgba(163,230,53,0.5)] transition hover:bg-glow-300 hover:shadow-[0_12px_40px_-4px_rgba(163,230,53,0.7)]"
            >
              <span className="relative">Run an audit</span>
              <ArrowRight size={16} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={onTryDemo}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium text-forest-100 transition hover:border-glow-400/30"
            >
              <Sparkles size={16} className="text-glow-400" strokeWidth={1.8} />
              Try a sample yard
            </button>
          </div>

          {/* trust meta strip */}
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/5 pt-6">
            <Stat value="< 8s" label="median analysis" />
            <Stat value="9" label="zone types" />
            <Stat value="ML vision" label="powered analysis" />
          </dl>
        </div>

        {/* RIGHT — interactive scanner stage */}
        <div className="relative">
          {/* ambient glow halo */}
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(163,230,53,0.18),transparent_75%)] blur-2xl" />

          <div
            ref={stageRef}
            className="glass-strong relative aspect-[4/5] w-full overflow-hidden rounded-[28px] sm:aspect-[5/6]"
            style={{
              transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transformStyle: "preserve-3d",
              transition: pointer.active ? "transform 0.08s linear" : "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* yard image */}
            <img
              src="/demo-yard.jpg"
              alt="Sample yard being analyzed"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
              draggable={false}
            />

            {/* darken overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-950/30 via-transparent to-forest-950/70" />

            {/* lattice grid */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <pattern id="lattice" width="6.25" height="6.25" patternUnits="userSpaceOnUse">
                  <path d="M 6.25 0 L 0 0 0 6.25" fill="none" stroke="rgba(163,230,53,0.18)" strokeWidth="0.1" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#lattice)" />
            </svg>

            {/* corner brackets — vision UI vibe */}
            <CornerBrackets />

            {/* zone overlays */}
            {DEMO_ZONES.map((z) => {
              const active = insideZone(z);
              const c = SEVERITY[z.severity];
              return (
                <div
                  key={z.id}
                  className="pointer-events-none absolute transition-all duration-300"
                  style={{
                    left: `${z.x}%`,
                    top: `${z.y}%`,
                    width: `${z.w}%`,
                    height: `${z.h}%`,
                    border: `1px ${active ? "solid" : "dashed"} ${c.ring}`,
                    background: active ? c.fill : "transparent",
                    boxShadow: active ? `0 0 32px -4px ${c.ring}` : "none",
                    transform: active ? "scale(1.01)" : "scale(1)",
                  }}
                >
                  <div
                    className={`absolute -top-7 left-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-data text-[10px] uppercase tracking-[0.12em] transition-opacity duration-300 ${
                      active ? "opacity-100" : "opacity-70"
                    }`}
                    style={{
                      background: active ? c.ring : "rgba(10,20,16,0.7)",
                      color: active ? "#0a1410" : "rgba(231,239,232,0.7)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span className="font-semibold">Z{z.id}</span>
                    <span>·</span>
                    <span>{z.label}</span>
                  </div>
                  <div
                    className={`absolute bottom-1 right-2 font-mono-data text-[10px] transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ color: c.ring }}
                  >
                    {z.metric}
                  </div>
                </div>
              );
            })}

            {/* readout HUD top-right */}
            <div
              className="pointer-events-none absolute right-3 top-3 rounded-lg px-2.5 py-1.5 font-mono-data text-[10px] uppercase tracking-[0.14em] text-glow-300"
              style={{ background: "rgba(10, 20, 16, 0.55)", border: "1px solid rgba(163, 230, 53, 0.2)" }}
            >
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-glow-400" />
                <span>Scanning</span>
              </div>
              <div className="mt-0.5 tabular text-forest-100/60">
                {String(Math.round(pointer.x)).padStart(3, "0")},{String(Math.round(pointer.y)).padStart(3, "0")}
              </div>
            </div>

            {/* readout HUD bottom-left */}
            <div
              className="pointer-events-none absolute bottom-3 left-3 rounded-lg px-2.5 py-1.5 font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/70"
              style={{ background: "rgba(10, 20, 16, 0.55)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="text-forest-100/50">Detected</div>
              <div className="font-semibold tabular text-glow-300">4 zones</div>
            </div>
          </div>

          {/* floating glass metric chips with parallax */}
          <FloatingChip
            className="absolute -left-4 top-10 hidden sm:flex"
            tx={tilt.ry * 1.6}
            ty={tilt.rx * 1.6}
            delay="0s"
          >
            <Droplet size={14} className="text-aurora-cyan" strokeWidth={2} />
            <div>
              <div className="font-mono-data text-[10px] uppercase tracking-wider text-forest-100/50">Water</div>
              <div className="font-display text-base text-forest-50">38<span className="text-forest-100/40">/100</span></div>
            </div>
          </FloatingChip>

          <FloatingChip
            className="absolute -right-2 top-1/4 hidden sm:flex"
            tx={tilt.ry * -1.4}
            ty={tilt.rx * -1.4}
            delay="0.4s"
          >
            <Sprout size={14} className="text-glow-400" strokeWidth={2} />
            <div>
              <div className="font-mono-data text-[10px] uppercase tracking-wider text-forest-100/50">Biodiv.</div>
              <div className="font-display text-base text-forest-50">41<span className="text-forest-100/40">/100</span></div>
            </div>
          </FloatingChip>

          <FloatingChip
            className="absolute -bottom-2 left-1/4 hidden sm:flex"
            tx={tilt.ry * 1.2}
            ty={tilt.rx * 1.2}
            delay="0.8s"
          >
            <Sun size={14} className="text-aurora-amber" strokeWidth={2} />
            <div>
              <div className="font-mono-data text-[10px] uppercase tracking-wider text-forest-100/50">Heat</div>
              <div className="font-display text-base text-forest-50">High</div>
            </div>
          </FloatingChip>

          <FloatingChip
            className="absolute -right-6 bottom-12 hidden sm:flex"
            tx={tilt.ry * -1.1}
            ty={tilt.rx * -1.1}
            delay="1.2s"
          >
            <Layers size={14} className="text-aurora-violet" strokeWidth={2} />
            <div>
              <div className="font-mono-data text-[10px] uppercase tracking-wider text-forest-100/50">Grade</div>
              <div className="font-display text-base text-glow-300">C+</div>
            </div>
          </FloatingChip>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl text-forest-50">{value}</dt>
      <dd className="mt-0.5 font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/45">
        {label}
      </dd>
    </div>
  );
}

function FloatingChip({
  children,
  className = "",
  tx = 0,
  ty = 0,
  delay = "0s",
}: {
  children: React.ReactNode;
  className?: string;
  tx?: number;
  ty?: number;
  delay?: string;
}) {
  return (
    <div
      className={`glass-strong items-center gap-2.5 rounded-2xl px-3 py-2 ${className}`}
      style={{
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        animation: `float-y 5s ease-in-out ${delay} infinite`,
      }}
    >
      {children}
    </div>
  );
}

function CornerBrackets() {
  const bracket = "absolute h-5 w-5 border-glow-400/70";
  return (
    <>
      <span className={`${bracket} left-3 top-3 border-l-2 border-t-2`} />
      <span className={`${bracket} right-3 top-3 border-r-2 border-t-2`} />
      <span className={`${bracket} bottom-3 left-3 border-b-2 border-l-2`} />
      <span className={`${bracket} bottom-3 right-3 border-b-2 border-r-2`} />
    </>
  );
}
