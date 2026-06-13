import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Close } from "./Icons";

type AuthMode = "signin" | "signup" | "verify";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp, verifyEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setMode("signin");
    setOtp("");
  }, [open]);

  if (!open) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
    else onClose();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signUp(email, password, name || undefined);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.needsVerification) {
      setMode("verify");
    } else {
      onClose();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await verifyEmail(email, otp);
    setLoading(false);
    if (err) setError(err);
    else onClose();
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    const err = await signInWithGoogle();
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/70 p-4 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-fade-up glass-strong relative w-full max-w-md overflow-hidden rounded-3xl p-7"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        {/* aurora glow accent */}
        <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-glow-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-aurora-cyan/10 blur-3xl" />

        <div className="relative mb-6 flex items-start justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
              <span className="inline-block h-1 w-1 rounded-full bg-glow-400" />
              {mode === "verify" ? "Almost there" : "Sign in"}
            </div>
            <h2 id="auth-title" className="font-display text-3xl text-forest-50 tracking-tight-display">
              {mode === "verify" ? "Verify your email" : "Save your work"}
            </h2>
            <p className="mt-1.5 text-sm text-forest-100/55">
              {mode === "verify"
                ? "Enter the 6-digit code we sent you"
                : "Keep your audits, watch your yard improve."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="glass-subtle inline-flex h-8 w-8 items-center justify-center rounded-full text-forest-100/60 transition hover:border-white/20 hover:text-forest-50"
            aria-label="Close"
          >
            <Close size={14} />
          </button>
        </div>

        <div className="relative">
          {mode !== "verify" && (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="glass-subtle flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-forest-50 transition hover:border-white/20 disabled:opacity-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
                  or email
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="mb-4 flex gap-1 rounded-xl border border-white/8 bg-white/[0.03] p-1">
                {(["signin", "signup"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setMode(tab);
                      setError(null);
                    }}
                    className={`
                      flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition
                      ${mode === tab
                        ? "bg-forest-50 text-forest-950 shadow-sm"
                        : "text-forest-100/55 hover:text-forest-100"
                      }
                    `}
                  >
                    {tab === "signin" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>
            </>
          )}

          {error && (
            <p className="mb-4 rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-3">
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
              <Field label="Password" type="password" value={password} onChange={setPassword} required />
              <SubmitButton loading={loading} label="Sign in" />
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-3">
              <Field label="Name" type="text" value={name} onChange={setName} placeholder="Optional" />
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
              <Field label="Password" type="password" value={password} onChange={setPassword} required />
              <SubmitButton loading={loading} label="Create account" />
            </form>
          )}

          {mode === "verify" && (
            <form onSubmit={handleVerify} className="space-y-3">
              <Field
                label="Verification code"
                type="text"
                value={otp}
                onChange={setOtp}
                placeholder="123456"
                required
              />
              <SubmitButton loading={loading} label="Verify & sign in" />
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="w-full text-sm text-forest-100/55 transition hover:text-forest-50"
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono-data text-[10px] uppercase tracking-[0.16em] text-forest-100/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="input-glass w-full rounded-xl px-3.5 py-2.5 text-sm"
      />
    </label>
  );
}

function SubmitButton({
  loading,
  label,
}: {
  loading: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full rounded-xl bg-glow-400 py-3 text-sm font-semibold text-forest-950 shadow-[0_8px_24px_-4px_rgba(163,230,53,0.45)] transition hover:bg-glow-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Please wait…" : label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
