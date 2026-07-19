import { create } from 'zustand';

export const useProductStore = create((set) => ({
  filters: {
    category: '',
    search: '',
  },
  setFilter: (key, value) => 
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    })),
  clearFilters: () => 
    set({ filters: { category: '', search: '' } })
}));
