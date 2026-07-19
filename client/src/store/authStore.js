import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../lib/apiClient';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await apiClient.post('/auth/login', { email, password });
          set({ user: data, isLoading: false });
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await apiClient.post('/auth/register', { name, email, password });
          set({ user: data, isLoading: false });
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
      },

      logout: async () => {
        try {
          await apiClient.post('/auth/logout');
          set({ user: null });
        } catch (error) {
          console.error('Logout error', error);
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
    }
  )
);
