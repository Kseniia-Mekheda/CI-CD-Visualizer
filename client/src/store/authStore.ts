import { create } from 'zustand';
import { api } from '../api/axios';
import { ROUTES } from '../constants/routes';

interface User {
  id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(ROUTES.ME);
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  login: async () => {
    try {
      const { data } = await api.get(ROUTES.ME);
      set({ user: data });
    } catch (error) {
      console.error('Не вдалося завантажити профіль після логіну');
      set({ user: null });
    }
  },

  logout: async () => {
    try {
      await api.post(ROUTES.LOGOUT);
    } finally {
      set({ user: null });
      window.location.href = '/';
    }
  },
}));
