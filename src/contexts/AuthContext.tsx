import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AuthUser } from '../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  login: (payload: { user: AuthUser; csrfToken?: string | null }) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  csrfToken: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const setUser = useCallback((nextUser: AuthUser | null) => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  const login = useCallback(
    ({ user: nextUser, csrfToken: nextCsrfToken }: { user: AuthUser; csrfToken?: string | null }) => {
      setUser(nextUser);
      setCsrfToken(nextCsrfToken ?? null);
    },
    [setUser],
  );

  const logout = useCallback(() => {
    setUser(null);
    setCsrfToken(null);
  }, [setUser]);

  const value = useMemo(
    () => ({
      user,
      csrfToken,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser,
    }),
    [csrfToken, login, logout, setUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
