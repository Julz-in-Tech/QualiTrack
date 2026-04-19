import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export type UserRole = "Admin" | "QC Inspector";

export interface AuthUser {
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "qualitrack.auth.user";

const demoAccounts: Array<{ role: UserRole; email: string; password: string }> = [
  { role: "Admin", email: "admin@qualitrack.local", password: "Admin123!" },
  { role: "QC Inspector", email: "inspector@qualitrack.local", password: "Inspect123!" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      const match = demoAccounts.find(
        (a) => a.email.toLowerCase() === normalized && a.password === password,
      );
      if (!match) {
        throw new Error("Invalid email or password");
      }
      const next: AuthUser = { email: match.email, role: match.role };
      setUser(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      toast.success(`Welcome back, ${match.role}!`);
      await navigate({ to: "/receiving" });
    },
    [navigate],
  );

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    void navigate({ to: "/auth" });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
