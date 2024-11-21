import { StateCreator } from 'zustand';
import { supabase } from '../../lib/supabase';
import { AuthState } from './types';
import { UserRole } from '../../types';

export interface UserManagementSlice extends AuthState {
  resetPassword: (identifier: string) => Promise<void>;
  changeUserPassword: (userId: string, newPassword: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
}

export const createUserManagementSlice: StateCreator<UserManagementSlice> = (set) => ({
  user: null,
  loading: false,
  error: null,
  users: [],

  resetPassword: async (identifier: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(identifier);
      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  changeUserPassword: async (userId: string, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ users: data || [], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (userId: string) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      set(state => ({
        users: state.users.filter(user => user.id !== userId),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateUserRole: async (userId: string, newRole: UserRole) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
});