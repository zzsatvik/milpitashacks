import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { LogOut } from "./Icons";

interface NavbarProps {
  showDemoBadge?: boolean;
  onNavigate?: (sectionId: string) => void;
}

export function Navbar({ showDemoBadge, onNavigate }: NavbarProps) {
  const { user, loading, configured, displayName, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40">
        <div className="absolute inset-0 -z-10 border-b border-white/[0.04] bg-forest-950/40 backdrop-blur-xl backdrop-saturate-150" />
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group flex items-center gap-3"
          >
            {/* logomark — abstract sprouting leaf set in a glass disc */}
            <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-forest-700 to-forest-900">
              <span className="absolute inset-0 bg-gradient-to-tr from-glow-400/30 via-transparent to-aurora-cyan/20" />
              <svg
                className="relative h-5 w-5 text-glow-300 transition-transform duration-500 group-hover:rotate-[8deg]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 20c0-9 6-15 16-16-.5 9-6.5 16-16 16Z" />
                <path d="M4 20 14 10" />
              </svg>
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-display text-[1.05rem] tracking-tight-display text-forest-50">
                Lawn<span className="text-glow-400">.</span>Audit
              </span>
              <span className="mt-0.5 hidden font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40 sm:block">
                Sustainability vision
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink sectionId="how-it-works" onNavigate={onNavigate}>
              How it works
            </NavLink>
            <NavLink sectionId="scoring" onNavigate={onNavigate}>
              Scoring
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {showDemoBadge && (
              <span className="hidden items-center gap-1.5 rounded-full border border-aurora-amber/30 bg-aurora-amber/10 px-2.5 py-1 font-mono-data text-[10px] uppercase tracking-[0.16em] text-aurora-amber sm:inline-flex">
                <span className="inline-block h-1 w-1 rounded-full bg-aurora-amber" />
                Demo
              </span>
            )}

            {loading ? (
              <div className="h-9 w-24 animate-pulse rounded-full bg-white/5" />
            ) : user ? (
              <div className="flex items-center gap-2.5">
                <span className="hidden font-mono-data text-xs uppercase tracking-[0.12em] text-forest-100/55 sm:inline">
                  {displayName}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-glow-400/30 bg-glow-400/10 font-display text-sm font-semibold text-glow-300">
                  {displayName?.charAt(0).toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="glass-subtle inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-forest-100/80 transition hover:border-white/20 hover:text-forest-50"
                >
                  <LogOut size={13} strokeWidth={1.8} />
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                disabled={!configured}
                title={configured ? "Sign in to save your audits" : "Add InsForge keys to .env to enable auth"}
                className="rounded-full bg-forest-50 px-4 py-2 text-sm font-semibold text-forest-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

function NavLink({
  children,
  sectionId,
  onNavigate,
}: {
  children: React.ReactNode;
  sectionId: string;
  onNavigate?: (sectionId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate?.(sectionId)}
      className="rounded-full px-3 py-1.5 text-sm text-forest-100/65 transition hover:bg-white/[0.04] hover:text-forest-50"
    >
      {children}
    </button>
  );
}
