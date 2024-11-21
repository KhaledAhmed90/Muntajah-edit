import { create } from 'zustand';
import { produce } from 'immer';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface FavoriteState {
  favorites: Product[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  lastFetch: number | null;
  cacheDuration: number;
  fetchFavorites: (forceRefresh?: boolean) => Promise<void>;
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  invalidateCache: () => void;
  shouldRefetch: () => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  loading: false,
  error: null,
  initialized: false,
  lastFetch: null,
  cacheDuration: 5 * 60 * 1000, // 5 minutes cache

  shouldRefetch: () => {
    const { lastFetch, cacheDuration } = get();
    if (!lastFetch) return true;
    return Date.now() - lastFetch > cacheDuration;
  },

  invalidateCache: () => {
    set({ initialized: false, lastFetch: null });
  },

  clearFavorites: () => {
    set({ favorites: [], initialized: false, lastFetch: null });
  },

  fetchFavorites: async (forceRefresh = false) => {
    const { initialized, loading, shouldRefetch } = get();
    if (!forceRefresh && initialized && !shouldRefetch()) return;

    set({ loading: true, error: null });
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        set({ favorites: [], initialized: true, lastFetch: Date.now() });
        return;
      }

      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select(`
          product_id,
          products (
            *,
            vendors (
              id,
              name
            ),
            reviews (
              rating
            )
          )
        `)
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      const products = favorites
        .filter(f => f.products) // Filter out any null products
        .map(f => ({
          id: f.products.id,
          name: f.products.name,
          description: f.products.description,
          price: f.products.price,
          image: f.products.image,
          image_base64: f.products.image_base64,
          inStock: f.products.in_stock,
          vendorId: f.products.vendors.id,
          vendorName: f.products.vendors.name,
          reviews: f.products.reviews || []
        }));

      set(produce((state) => {
        state.favorites = products;
        state.initialized = true;
        state.lastFetch = Date.now();
        state.error = null;
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addFavorite: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        throw new Error('User must be logged in to add favorites');
      }

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: session.session.user.id,
          product_id: productId
        });

      if (error) throw error;
      await get().fetchFavorites(true);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeFavorite: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        throw new Error('User must be logged in to remove favorites');
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      set(produce((state) => {
        state.favorites = state.favorites.filter(f => f.id !== productId);
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  isFavorite: (productId: string) => {
    return get().favorites.some(f => f.id === productId);
  }
}));