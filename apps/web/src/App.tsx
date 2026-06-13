import { useCallback, useState } from "react";
import type { LawnAnalysis } from "@lawn-audit/shared";
import { AnalyzingScreen } from "./components/AnalyzingScreen";
import { AuditHistory } from "./components/AuditHistory";
import { AuditResults } from "./components/AuditResults";
import { Navbar } from "./components/Navbar";
import { PhotoUpload } from "./components/PhotoUpload";
import { useAuth } from "./contexts/AuthContext";
import { analyzeLawnImage, urlToDataUrl } from "./lib/analyzeLawn";
import { saveAudit } from "./lib/audits";
import { MOCK_ANALYSIS } from "./lib/mockAnalysis";
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

  const runAnalysis = useCallback(
    async (dataUrl: string) => {
      setPhase("analyzing");
      setError(null);
      setSavedReplay(false);

      try {
        let result: LawnAnalysis;
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 2500));
          result = MOCK_ANALYSIS;
        } else {
          result = await analyzeLawnImage(dataUrl);
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

  const handleUpload = useCallback(
    (_file: File, dataUrl: string) => {
      setImageUrl(dataUrl);
      runAnalysis(dataUrl);
    },
    [runAnalysis],
  );

  const handleTryDemo = useCallback(async () => {
    setError(null);
    try {
      const dataUrl = await urlToDataUrl("/demo-yard.jpg");
      setImageUrl(dataUrl);
      runAnalysis(dataUrl);
    } catch {
      setError("Could not load demo photo");
    }
  }, [runAnalysis]);

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

  return (
    <div className="min-h-screen">
      <Navbar showDemoBadge={USE_MOCK} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {phase === "landing" && (
          <div className="animate-fade-up">
            <section className="mb-10 text-center">
              <h2 className="font-display text-4xl leading-tight text-forest-900 md:text-5xl">
                Know your lawn&apos;s
                <br />
                <span className="text-forest-600">environmental footprint</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-forest-600">
                Upload a photo of your yard. Our AI maps every zone, scores
                water use and biodiversity, and shows you exactly what to change.
              </p>
            </section>

            <div className="mx-auto max-w-xl">
              <PhotoUpload onUpload={handleUpload} />
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-forest-200" />
                <span className="text-xs font-medium text-forest-500">or</span>
                <div className="h-px flex-1 bg-forest-200" />
              </div>
              <button
                type="button"
                onClick={handleTryDemo}
                className="mt-4 w-full rounded-xl border border-forest-300 bg-white/80 px-4 py-3 text-sm font-semibold text-forest-800 transition hover:border-forest-400 hover:bg-white hover:shadow-sm"
              >
                Try with a sample yard photo →
              </button>
              {error && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}
            </div>

            <section className="mt-16 grid gap-6 sm:grid-cols-3">
              <FeatureCard
                icon="📸"
                title="Snap & upload"
                desc="One photo from your yard — that's all we need"
              />
              <FeatureCard
                icon="🔍"
                title="AI zone mapping"
                desc="GPT-4o Vision identifies turf, natives, hardscape & more"
              />
              <FeatureCard
                icon="💡"
                title="Actionable swaps"
                desc="See before & after with water & carbon impact estimates"
              />
            </section>

            <AuditHistory onLoadAudit={handleLoadSavedAudit} />
          </div>
        )}

        {phase === "analyzing" && <AnalyzingScreen imageUrl={imageUrl} />}

        {phase === "results" && imageUrl && analysis && (
          <>
            {savedReplay && (
              <p className="mb-4 rounded-lg bg-forest-100 px-4 py-2 text-sm text-forest-700">
                Viewing a saved audit — zone layout shown on sample photo
              </p>
            )}
            <AuditResults
              imageUrl={imageUrl}
              analysis={analysis}
              onStartOver={handleStartOver}
            />
          </>
        )}
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-forest-200/60 bg-white/50 p-6 text-center">
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-3 font-display text-lg text-forest-800">{title}</h3>
      <p className="mt-1 text-sm text-forest-600">{desc}</p>
    </div>
  );
}

export default App;
