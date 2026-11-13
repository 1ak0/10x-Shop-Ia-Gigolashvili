import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { userStorage } from "../models/storage";
import type { AuthUser, ProfileFormValues } from "../types/user";

/*
 * Educational login: no server, no real credentials.
 * A valid username, email and password "log in" — we only keep the username and email
 * (and later the profile fields) in React state. The password is never stored or sent.
 */

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  displayName: string;
  login: (username: string, email: string) => void;
  logout: () => void;
  updateProfile: (values: ProfileFormValues) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function createUser(username: string, email: string): AuthUser {
  return { username, firstName: "", lastName: "", email, phone: "" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Optional persistence (shop_user) so a page refresh keeps the session.
  const [user, setUser] = useState<AuthUser | null>(() => userStorage.get());

  useEffect(() => {
    if (user) userStorage.set(user);
    else userStorage.remove();
  }, [user]);

  const login = useCallback((username: string, email: string) => {
    const name = username.trim();
    const mail = email.trim();
    // Same username again → keep the saved profile, just update the email.
    setUser((current) => (current?.username === name ? { ...current, email: mail } : createUser(name, mail)));
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((values: ProfileFormValues) => {
    setUser((current) =>
      current
        ? {
            ...current,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
          }
        : current,
    );
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
    return {
      user,
      isLoggedIn: user !== null,
      displayName: fullName || user?.username || "Guest",
      login,
      logout,
      updateProfile,
    };
  }, [user, login, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}