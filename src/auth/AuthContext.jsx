import { createContext, useContext, useMemo, useState } from "react";
import { AUTH_TOKEN_KEY } from "../data/api";

const AuthContext = createContext(null);

function userFromToken(token) {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const claims = JSON.parse(window.atob(paddedPayload));
    return { id: claims.sub, username: claims.username, email: claims.email, role: claims.role };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.sessionStorage.getItem(AUTH_TOKEN_KEY));
  const user = token ? userFromToken(token) : null;

  function login(nextToken) {
    window.sessionStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    setToken(nextToken);
  }

  function logout() {
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
  }

  const value = useMemo(() => ({
    token,
    user,
    isSignedIn: Boolean(token && user),
    login,
    logout,
  }), [token, user?.id, user?.username]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
