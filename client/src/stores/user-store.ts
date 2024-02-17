import { create } from 'zustand';
import { User } from '@/types/user';

type UserState = {
  user: User;
  isInitialized: boolean;
  initializeUser: (user: User) => void;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserState>(set => ({
  user: null,
  isInitialized: false,
  initializeUser: user => set({ user, isInitialized: true }),
  setUser: user => set({ user }),
}));
