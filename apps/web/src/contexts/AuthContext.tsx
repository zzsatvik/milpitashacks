import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { insforge, isInsforgeConfigured, type InsforgeUser } from "../lib/insforge";

interface AuthContextValue {
  user: InsforgeUser | null;
  loading: boolean;
  configured: boolean;
  displayName: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ error: string | null; needsVerification: boolean }>;
  verifyEmail: (email: string, otp: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getDisplayName(user: InsforgeUser | null): string | null {
  if (!user) return null;
  const profile = user.profile as { name?: string } | undefined;
  if (profile?.name?.trim()) return profile.name.trim();
  if (user.email) return user.email.split("@")[0];
  return "User";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<InsforgeUser | null>(null);
  const [loading, setLoading] = useState(isInsforgeConfigured());

  const refreshUser = useCallback(async () => {
    if (!insforge) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data, error } = await insforge.auth.getCurrentUser();
    if (error) {
      setUser(null);
    } else {
      setUser(data.user);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!insforge) return;
    refreshUser();
  }, [refreshUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!insforge) return "Auth is not configured";

    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return error.message ?? "Sign in failed";
    setUser(data?.user ?? null);
    return null;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      if (!insforge) {
        return { error: "Auth is not configured", needsVerification: false };
      }

      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name,
        redirectTo: window.location.origin,
      });

      if (error) {
        return {
          error: error.message ?? "Sign up failed",
          needsVerification: false,
        };
      }

      if (data?.requireEmailVerification) {
        return { error: null, needsVerification: true };
      }

      if (data?.accessToken && data.user) {
        setUser(data.user);
      }

      return { error: null, needsVerification: false };
    },
    [],
  );

  const verifyEmail = useCallback(async (email: string, otp: string) => {
    if (!insforge) return "Auth is not configured";

    const { data, error } = await insforge.auth.verifyEmail({ email, otp });
    if (error) return error.message ?? "Verification failed";
    if (data?.user) setUser(data.user);
    return null;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!insforge) return "Auth is not configured";

    const { error } = await insforge.auth.signInWithOAuth("google", {
      redirectTo: window.location.origin,
    });

    return error?.message ?? null;
  }, []);

  const signOut = useCallback(async () => {
    if (!insforge) return;
    await insforge.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured: isInsforgeConfigured(),
      displayName: getDisplayName(user),
      signIn,
      signUp,
      verifyEmail,
      signInWithGoogle,
      signOut,
      refreshUser,
    }),
    [
      user,
      loading,
      signIn,
      signUp,
      verifyEmail,
      signInWithGoogle,
      signOut,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
