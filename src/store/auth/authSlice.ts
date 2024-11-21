import { StateCreator } from 'zustand';
import { supabase } from '../../lib/supabase';
import { AuthState, AuthUser } from './types';
import { UserRole } from '../../types';
import { useFavoriteStore } from '../favoriteStore';
import { useVendorStore } from '../vendorStore';

export interface AuthSlice extends AuthState {
  setUser: (user: AuthUser | null) => void;
  signIn: (identifier: string, password: string, isPhone?: boolean) => Promise<void>;
  signUp: (identifier: string, password: string, name: string, role: UserRole, isPhone?: boolean) => Promise<{ success: boolean }>;
  verifyOTP: (phone: string, token: string) => Promise<{ success: boolean }>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (profile: Partial<AuthUser>) => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  user: null,
  loading: false,
  error: null,
  users: [],

  setUser: (user) => set({ user }),

  initializeAuth: async () => {
    set({ loading: true });
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            vendors (*)
          `)
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) throw new Error('Profile not found');

        set({
          user: {
            id: profile.user_id,
            role: profile.role,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            avatar_base64: profile.avatar_base64,
            city: profile.city,
            district: profile.district,
            vendorId: profile.vendor_id,
            vendor: profile.vendors
          },
          error: null
        });

        // Initialize user-specific data
        if (profile.role === 'vendor') {
          await useVendorStore.getState().fetchVendors();
        }
        await useFavoriteStore.getState().fetchFavorites();
      }
    } catch (error) {
      set({ error: (error as Error).message });
      // Clear any invalid session
      await supabase.auth.signOut();
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (identifier: string, password: string, isPhone = false) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        [isPhone ? 'phone' : 'email']: identifier,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user data received');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          vendors (*)
        `)
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Profile not found');

      set({
        user: {
          id: profile.user_id,
          role: profile.role,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatar_base64: profile.avatar_base64,
          city: profile.city,
          district: profile.district,
          vendorId: profile.vendor_id,
          vendor: profile.vendors
        },
        error: null
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (identifier: string, password: string, name: string, role: UserRole, isPhone = false) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        [isPhone ? 'phone' : 'email']: identifier,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user data received');

      if (!isPhone) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name,
            [isPhone ? 'phone' : 'email']: identifier,
            role
          });

        if (profileError) throw profileError;
      }

      return { success: true };
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  verifyOTP: async (phone: string, token: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.verifyOTP({
        phone,
        token,
        type: 'sms'
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user data received');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          name: data.user.user_metadata.name,
          phone,
          role: data.user.user_metadata.role
        });

      if (profileError) throw profileError;

      return { success: true };
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all stores
      set({ user: null, error: null });
      useFavoriteStore.getState().clearFavorites();
      useVendorStore.getState().invalidateCache();
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

updateProfile: async (profile) => {
    set({ loading: true, error: null });
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatar_base64: profile.avatar_base64,
          city: profile.city,
          district: profile.district
        })
        .eq('user_id', profile.id);

      if (updateError) throw updateError;

      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select(`
          *,
          vendors (*)
        `)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!updatedProfile) throw new Error('Profile not found');

      set(state => ({
        user: {
          id: updatedProfile.user_id,
          role: updatedProfile.role,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          avatar_base64: updatedProfile.avatar_base64,
          city: updatedProfile.city,
          district: updatedProfile.district,
          vendorId: updatedProfile.vendor_id,
          vendor: updatedProfile.vendors
        },
        error: null
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }});