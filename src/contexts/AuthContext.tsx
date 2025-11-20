import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { AuthUser } from '../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  login: (payload: { user: AuthUser; csrfToken?: string | null }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  csrfToken: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const login = ({ user: nextUser, csrfToken: nextCsrfToken }: { user: AuthUser; csrfToken?: string | null }) => {
    setUser(nextUser);
    setCsrfToken(nextCsrfToken ?? null);
  };

  const logout = () => {
    setUser(null);
    setCsrfToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      csrfToken,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [csrfToken, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
