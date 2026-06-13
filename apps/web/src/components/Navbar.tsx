import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";

interface NavbarProps {
  showDemoBadge?: boolean;
}

export function Navbar({ showDemoBadge }: NavbarProps) {
  const { user, loading, configured, displayName, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-forest-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h1 className="font-display text-xl font-semibold text-forest-900">
                Lawn Audit
              </h1>
              <p className="hidden text-xs text-forest-500 sm:block">
                AI-powered yard sustainability analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showDemoBadge && (
              <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 sm:inline">
                Demo mode
              </span>
            )}

            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded-lg bg-forest-100" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-forest-700 sm:inline">
                  Welcome,{" "}
                  <span className="font-semibold text-forest-900">
                    {displayName}
                  </span>
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white sm:hidden">
                  {displayName?.charAt(0).toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-lg border border-forest-300 px-3 py-2 text-sm font-medium text-forest-700 transition hover:bg-forest-50"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                disabled={!configured}
                title={
                  configured
                    ? "Sign in to save your audits"
                    : "Add InsForge keys to .env to enable auth"
                }
                className="rounded-lg bg-forest-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
