import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User { _id: string; name: string; email: string; isAdmin: boolean; avatar?: string; phone?: string; }

interface AuthState {
  user: User | null; token: string | null; isLoading: boolean;
  setUser: (u: User | null) => void; setToken: (t: string | null) => void;
  setLoading: (l: boolean) => void; login: (u: User, t: string) => void;
  logout: () => Promise<void>; initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null, token: null, isLoading: true,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  login: (user, token) => set({ user, token }),
  logout: async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    set({ user: null, token: null });
  },
  initialize: async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) { const { data } = await res.json(); set({ user: data.user }); }
      else set({ user: null, token: null });
    } catch { set({ user: null, token: null }); }
    finally { set({ isLoading: false }); }
  },
}), { name: 'auth-storage', partialize: (s) => ({ token: s.token, user: s.user }) }));
