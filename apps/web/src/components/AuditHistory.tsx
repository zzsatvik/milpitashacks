import { useEffect, useState } from "react";
import type { LawnAnalysis } from "@lawn-audit/shared";
import { useAuth } from "../contexts/AuthContext";
import { fetchUserAudits, type SavedAudit } from "../lib/audits";

interface AuditHistoryProps {
  onLoadAudit: (analysis: LawnAnalysis) => void;
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
    <section className="mt-12 rounded-2xl border border-forest-200/80 bg-white/70 p-6">
      <h3 className="font-display text-xl text-forest-900">Your past audits</h3>
      <p className="mt-1 text-sm text-forest-600">
        Tap an audit to reload its results
      </p>

      {loading ? (
        <div className="mt-4 space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-forest-100"
            />
          ))}
        </div>
      ) : audits.length === 0 ? (
        <p className="mt-4 text-sm text-forest-500">
          No saved audits yet — run your first one above!
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {audits.map((audit) => (
            <li key={audit.id}>
              <button
                type="button"
                onClick={() => onLoadAudit(audit.analysis)}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-forest-100 bg-forest-50/50 px-4 py-3 text-left transition hover:border-forest-300 hover:bg-forest-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-forest-900">
                    {audit.summary}
                  </p>
                  <p className="mt-0.5 text-xs text-forest-500">
                    {new Date(audit.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-forest-600 px-3 py-1 font-display text-lg font-bold text-white">
                  {audit.overall_grade}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
