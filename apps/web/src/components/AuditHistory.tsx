import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchUserAudits, type SavedAudit } from "../lib/audits";
import { ChevronRight, Clock } from "./Icons";

interface AuditHistoryProps {
  onLoadAudit: (saved: SavedAudit) => void;
}

export function AuditHistory({ onLoadAudit }: AuditHistoryProps) {
  const { user } = useAuth();
  const [audits, setAudits] = useState<SavedAudit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAudits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchUserAudits(user.id).then((data) => {
      setAudits(data);
      setLoading(false);
    });
  }, [user]);

  if (!user) return null;

  return (
    <section className="glass mt-14 rounded-3xl p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
            <Clock size={11} strokeWidth={2} />
            History
          </div>
          <h3 className="mt-1 font-display text-2xl tracking-tight-display text-forest-50">
            Your past audits
          </h3>
          <p className="mt-1 text-sm text-forest-100/55">
            Tap an audit to reload its results
          </p>
        </div>
        {!loading && audits.length > 0 && (
          <span className="font-mono-data text-[10px] uppercase tracking-[0.14em] text-forest-100/45">
            {audits.length} saved
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-5 space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="glass-subtle h-20 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : audits.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-forest-100/45">
          No saved audits yet — your first one will appear here.
        </p>
      ) : (
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {audits.map((audit) => (
            <li key={audit.id}>
              <button
                type="button"
                onClick={() => onLoadAudit(audit)}
                className="bento group flex w-full items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 text-left transition hover:bg-white/[0.04]"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-glow-400/25 bg-glow-400/8 font-display text-xl font-semibold text-glow-300">
                  {audit.overall_grade}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-forest-50">
                    {audit.summary}
                  </p>
                  <p className="mt-0.5 font-mono-data text-[10px] uppercase tracking-[0.12em] text-forest-100/40">
                    {new Date(audit.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="shrink-0 text-forest-100/35 transition group-hover:translate-x-0.5 group-hover:text-glow-300"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
