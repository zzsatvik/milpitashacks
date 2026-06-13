import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-fade-up w-full max-w-md rounded-2xl border border-forest-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 id="auth-title" className="font-display text-2xl text-forest-900">
              {mode === "verify" ? "Verify email" : "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-forest-600">
              {mode === "verify"
                ? "Enter the 6-digit code sent to your email"
                : "Sign in to save and revisit your lawn audits"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-forest-400 hover:bg-forest-50 hover:text-forest-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {mode !== "verify" && (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-forest-200 bg-white py-2.5 text-sm font-medium text-forest-800 transition hover:bg-forest-50 disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-forest-200" />
              <span className="text-xs text-forest-500">or</span>
              <div className="h-px flex-1 bg-forest-200" />
            </div>

            <div className="mb-4 flex gap-1 rounded-lg bg-forest-100 p-1">
              {(["signin", "signup"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setMode(tab);
                    setError(null);
                  }}
                  className={`
                    flex-1 rounded-md py-2 text-sm font-semibold capitalize transition
                    ${mode === tab
                      ? "bg-white text-forest-900 shadow-sm"
                      : "text-forest-600"
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
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-3">
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
            />
            <SubmitButton loading={loading} label="Sign in" />
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <Field
              label="Name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Optional"
            />
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
            />
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
              className="w-full text-sm text-forest-600 hover:text-forest-800"
            >
              Back to sign in
            </button>
          </form>
        )}
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
      <span className="mb-1 block text-sm font-medium text-forest-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-forest-200 px-3 py-2.5 text-sm text-forest-900 outline-none transition focus:border-forest-400 focus:ring-2 focus:ring-forest-200"
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
      className="w-full rounded-xl bg-forest-600 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700 disabled:opacity-50"
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
