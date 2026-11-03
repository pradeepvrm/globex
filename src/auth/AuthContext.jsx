import { createContext, useContext, useMemo, useState } from "react";
import { AUTH_TOKEN_KEY } from "../data/api";

const apiBaseUrl = import.meta.env.VITE_API_URL;

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

  const loginWithGoogle = async (credential) => {
    const response = await fetch(`${apiBaseUrl}/api/users/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.msg || "Google authentication failed.");
    }
    login(result.data.token);
    return result.data;
  };

  function logout() {
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
  }

  const value = useMemo(() => ({
    token,
    user,
    isSignedIn: Boolean(token && user),
    login,
    loginWithGoogle,
    logout,
  }), [token, user?.id, user?.username, login, loginWithGoogle, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
