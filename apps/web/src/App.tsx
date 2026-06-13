import { useCallback, useEffect, useRef, useState } from "react";
import type { LawnAnalysis } from "@lawn-audit/shared";
import { AnalyzingScreen } from "./components/AnalyzingScreen";
import { AuditHistory } from "./components/AuditHistory";
import { AuditResults } from "./components/AuditResults";
import { Hero } from "./components/Hero";
import { ScoringSection } from "./components/InfoSections";
import { Navbar } from "./components/Navbar";
import { PhotoUpload } from "./components/PhotoUpload";
import { ZipCodeField } from "./components/ZipCodeField";
import { Aperture, Layers, Idea, Sparkles } from "./components/Icons";
import { useAuth } from "./contexts/AuthContext";
import { analyzeLawnImage, urlToDataUrl } from "./lib/analyzeLawn";
import { saveAudit } from "./lib/audits";
import { isValidZipCode, normalizeZipCode, getStoredZipCode } from "./lib/location";
import { buildMockAnalysis } from "./lib/mockAnalysis";
import type { AppPhase } from "./types";
import { useMockMode } from "./lib/env";

const USE_MOCK = useMockMode();

function App() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<AppPhase>("landing");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<LawnAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedReplay, setSavedReplay] = useState(false);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState(getStoredZipCode);
  const uploadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "landing" || !pendingScroll) return;
    const el = document.getElementById(pendingScroll);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingScroll(null);
    }
  }, [phase, pendingScroll]);

  const runAnalysis = useCallback(
    async (dataUrl: string, zip?: string) => {
      setPhase("analyzing");
      setError(null);
      setSavedReplay(false);

      const zipForAnalysis = zip && isValidZipCode(zip) ? normalizeZipCode(zip) : undefined;

      try {
        let result: LawnAnalysis;
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 2500));
          result = buildMockAnalysis(zipForAnalysis ?? "95035");
        } else {
          result = await analyzeLawnImage(dataUrl, zipForAnalysis);
        }

        setAnalysis(result);
        setPhase("results");

        if (user) {
          saveAudit(user.id, result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed");
        setPhase("landing");
      }
    },
    [user],
  );

  const startAnalysis = useCallback(
    (dataUrl: string) => {
      if (!isValidZipCode(zipCode)) {
        setError("Enter a valid 5-digit ZIP code before running an audit");
        return;
      }
      setError(null);
      setImageUrl(dataUrl);
      runAnalysis(dataUrl, zipCode);
    },
    [runAnalysis, zipCode],
  );

  const handleUpload = useCallback(
    (_file: File, dataUrl: string) => {
      startAnalysis(dataUrl);
    },
    [startAnalysis],
  );

  const handleTryDemo = useCallback(async () => {
    if (!isValidZipCode(zipCode)) {
      setError("Enter a valid 5-digit ZIP code before running an audit");
      return;
    }
    setError(null);
    try {
      const dataUrl = await urlToDataUrl("/demo-yard.jpg");
      startAnalysis(dataUrl);
    } catch {
      setError("Could not load demo photo");
    }
  }, [startAnalysis, zipCode]);

  const handleLoadSavedAudit = useCallback(async (saved: LawnAnalysis) => {
    setAnalysis(saved);
    setSavedReplay(true);
    try {
      const dataUrl = await urlToDataUrl("/demo-yard.jpg");
      setImageUrl(dataUrl);
    } catch {
      setImageUrl("/demo-yard.jpg");
    }
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleStartOver = () => {
    setPhase("landing");
    setImageUrl(null);
    setAnalysis(null);
    setError(null);
    setSavedReplay(false);
  };

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleNavSection = useCallback(
    (sectionId: string) => {
      if (phase !== "landing") {
        setPhase("landing");
        setImageUrl(null);
        setAnalysis(null);
        setError(null);
        setSavedReplay(false);
        setPendingScroll(sectionId);
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [phase],
  );

  return (
    <div className="app-shell min-h-screen">
      <Navbar showDemoBadge={USE_MOCK} onNavigate={handleNavSection} />

      <main>
        {phase === "landing" && (
          <div className="animate-fade-in">
            <Hero onUploadClick={scrollToUpload} onTryDemo={handleTryDemo} />

            {/* Upload + section */}
            <section
              ref={uploadRef}
              id="upload"
              className="mx-auto max-w-3xl px-6 pb-10 pt-4"
            >
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
                  <span className="inline-block h-1 w-1 rounded-full bg-glow-400" />
                  Step 01
                </div>
                <h2 className="mt-2 font-display text-3xl tracking-tight-display text-forest-50 sm:text-4xl">
                  Drop in a yard photo
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-forest-100/55">
                  Any angle works. One photo is all we need to start mapping zones.
                </p>
              </div>

              <div className="mb-5">
                <ZipCodeField value={zipCode} onChange={setZipCode} required />
              </div>

              <PhotoUpload onUpload={handleUpload} disabled={!isValidZipCode(zipCode)} />

              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/8" />
                <span className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
                  or
                </span>
                <div className="h-px flex-1 bg-white/8" />
              </div>

              <button
                type="button"
                onClick={handleTryDemo}
                disabled={!isValidZipCode(zipCode)}
                className="glass-subtle group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-medium text-forest-100/85 transition hover:border-glow-400/30 hover:text-forest-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles size={15} className="text-glow-400" strokeWidth={1.8} />
                Run on a sample yard
                <span className="ml-1 text-forest-100/40 transition group-hover:text-glow-300">→</span>
              </button>

              {error && (
                <p className="mt-4 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              )}
            </section>

            {/* Process explainer */}
            <section
              id="how-it-works"
              className="scroll-mt-24 mx-auto max-w-6xl px-6 py-14"
            >
              <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
                  <span className="inline-block h-1 w-1 rounded-full bg-glow-400" />
                  How it works
                </div>
                <h2 className="mt-2 font-display text-3xl tracking-tight-display text-forest-50 sm:text-4xl text-balance">
                  From snapshot to <em className="italic text-glow-300">science</em> in&nbsp;seconds.
                </h2>
              </div>

              <div className="grid gap-5 stagger md:grid-cols-3">
                <BentoCard
                  step="01"
                  icon={<Aperture size={22} strokeWidth={1.4} />}
                  title="Capture"
                  desc="One photo of your yard. Phone camera is more than enough resolution."
                />
                <BentoCard
                  step="02"
                  icon={<Layers size={22} strokeWidth={1.4} />}
                  title="Decode"
                  desc="A vision-tuned machine learning model segments turf, natives, hardscape, and bare soil into zones."
                />
                <BentoCard
                  step="03"
                  icon={<Idea size={22} strokeWidth={1.4} />}
                  title="Act"
                  desc="See water, carbon, and biodiversity impact for every recommended swap."
                />
              </div>
            </section>

            <ScoringSection />

            <div className="mx-auto max-w-6xl px-6">
              <AuditHistory onLoadAudit={handleLoadSavedAudit} />
            </div>

            <Footer />
          </div>
        )}

        {phase === "analyzing" && (
          <div className="mx-auto max-w-6xl px-6">
            <AnalyzingScreen imageUrl={imageUrl} />
          </div>
        )}

        {phase === "results" && imageUrl && analysis && (
          <div className="mx-auto max-w-6xl px-6">
            {savedReplay && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-glow-400/25 bg-glow-400/8 px-3 py-1.5 font-mono-data text-[10px] uppercase tracking-[0.14em] text-glow-300">
                <span className="inline-block h-1 w-1 rounded-full bg-glow-400" />
                Replay&nbsp;·&nbsp;Layout shown on sample photo
              </p>
            )}
            <AuditResults
              imageUrl={imageUrl}
              analysis={analysis}
              zipCode={zipCode}
              onStartOver={handleStartOver}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function BentoCard({
  step,
  icon,
  title,
  desc,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bento glass relative overflow-hidden rounded-3xl p-7">
      <div className="absolute right-5 top-5 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/35">
        {step}
      </div>
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-glow-400/20 bg-glow-400/8 text-glow-300">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-2xl tracking-tight-display text-forest-50">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-forest-100/60">{desc}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mx-auto mt-20 max-w-6xl border-t border-white/5 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
          <span className="inline-block h-1 w-1 rounded-full bg-glow-400" />
          Lawn.Audit&nbsp;·&nbsp;Built for measurable biodiversity
        </div>
        <div className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/30">
          v0.1
        </div>
      </div>
    </footer>
  );
}

export default App;
