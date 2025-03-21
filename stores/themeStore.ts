import { create } from 'zustand';

interface ThemeState {
  isDark: boolean | null;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: null,
  toggleTheme: () => set((state) => ({ isDark: !(state.isDark ?? false) })),
}));