import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ledger_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('ledger_user');
    return raw ? JSON.parse(raw) : null;
  });

  const persist = (token, user) => {
    localStorage.setItem('ledger_token', token);
    localStorage.setItem('ledger_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    persist(data.token, data.user);
  }, []);

  const register = useCallback(async (email, password) => {
    const data = await api.register(email, password);
    persist(data.token, data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ledger_token');
    localStorage.removeItem('ledger_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
