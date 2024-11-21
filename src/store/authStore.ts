import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './auth/authSlice';
import { UserManagementSlice, createUserManagementSlice } from './auth/userManagementSlice';
import { persist } from 'zustand/middleware';

type StoreState = AuthSlice & UserManagementSlice;

export const useAuthStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createUserManagementSlice(...args),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);