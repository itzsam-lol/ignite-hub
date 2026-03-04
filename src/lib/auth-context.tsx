import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  role: 'AMBASSADOR' | 'ADMIN' | 'ambassador' | 'admin';
  accountStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  college?: string;
  enrollmentId?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (_data: SignupData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const TOKEN_KEY = 'ignite_token';
const USER_KEY = 'ignite_user';

/** Returns whichever storage currently holds the token */
function getStorage(): Storage {
  if (localStorage.getItem(TOKEN_KEY)) return localStorage;
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
  return sessionStorage; // default for new sessions
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session — check both storages
    const storage = getStorage();
    const savedToken = storage.getItem(TOKEN_KEY);
    const savedUser = storage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        storage.removeItem(TOKEN_KEY);
        storage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login — rememberMe=true persists in localStorage (survives browser close),
   *          rememberMe=false uses sessionStorage (cleared on tab close).
   *
   * Backend issues a 7-day JWT for normal, 30-day for "remember me".
   * Frontend just controls which storage holds the credentials.
   */
  const login = async (email: string, password: string, rememberMe = false) => {
    const res = await api.login(email, password);
    const storage = rememberMe ? localStorage : sessionStorage;

    // Clear old tokens from both storages first
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    storage.setItem(TOKEN_KEY, res.token);
    storage.setItem(USER_KEY, JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
  };

  const signup = async (_data: SignupData) => {
    // Signup now goes to approval flow — new SignupPage handles this directly
    throw new Error('Use SignupPage directly — signup now requires admin approval.');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      isAdmin: user?.role === 'ADMIN' || user?.role === 'admin',
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
