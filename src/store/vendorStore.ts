import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Vendor, Product, Review } from '../types';

interface VendorState {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  lastFetch: number | null;
  cacheDuration: number;
  fetchVendors: (forceRefresh?: boolean) => Promise<void>;
  updateVendor: (vendor: Vendor) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  addVendor: (vendor: Omit<Vendor, 'id'>) => Promise<void>;
  addProduct: (vendorId: string, product: Omit<Product, 'id' | 'reviews'>) => Promise<void>;
  updateProduct: (vendorId: string, product: Product) => Promise<void>;
  deleteProduct: (vendorId: string, productId: string) => Promise<void>;
  addReview: (productId: string, review: { profile_id: string; rating: number; comment: string }) => Promise<{ id: string }>;
  updateReview: (productId: string, review: { id: string; profile_id: string; rating: number; comment: string }) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  invalidateCache: () => void;
  shouldRefetch: () => boolean;
}

export const useVendorStore = create<VendorState>((set, get) => ({
  vendors: [],
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

  fetchVendors: async (forceRefresh = false) => {
    // Skip if already initialized and has data, unless forced refresh
    if (!forceRefresh && get().initialized && get().vendors.length > 0 && !get().shouldRefetch()) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data: vendors, error: vendorsError } = await supabase
        .from('vendors')
        .select(`
          *,
          products (
            *,
            reviews (
              *,
              profiles!reviews_profile_id_fkey (
                name
              )
            )
          )
        `);

      if (vendorsError) throw vendorsError;

      const transformedVendors = vendors.map((vendor: any) => ({
        ...vendor,
        products: vendor.products.map((product: any) => ({
          ...product,
          inStock: product.in_stock,
          reviews: product.reviews.map((review: any) => ({
            id: review.id,
            userId: review.profile_id,
            userName: review.profiles.name,
            rating: review.rating,
            comment: review.comment,
            date: new Date(review.created_at).toISOString()
          }))
        }))
      }));

      set({ 
        vendors: transformedVendors, 
        error: null, 
        initialized: true,
        lastFetch: Date.now()
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  invalidateCache: () => {
    set({ initialized: false, lastFetch: null });
  },

  // Rest of the store methods remain unchanged
  addVendor: async (vendor: Omit<Vendor, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('vendors')
        .insert(vendor);

      if (error) throw error;
      get().invalidateCache();
      await get().fetchVendors(true);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateVendor: async (vendor: Vendor) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('vendors')
        .update({
          name: vendor.name,
          category: vendor.category,
          location: vendor.location,
          coordinates: vendor.coordinates,
          phone: vendor.phone,
          description: vendor.description,
          image: vendor.image,
          image_base64: vendor.image_base64
        })
        .eq('id', vendor.id);

      if (error) throw error;
      get().invalidateCache();
      await get().fetchVendors(true);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteVendor: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      get().invalidateCache();
      await get().fetchVendors(true);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (vendorId: string, product: Omit<Product, 'id' | 'reviews'>) => {
    set({ loading: true, error: null });
    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          vendor_id: vendorId,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          image_base64: product.image_base64,
          in_stock: product.inStock
        });

      if (insertError) throw insertError;
      get().invalidateCache();
      await get().fetchVendors(true);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (vendorId: string, product: Product) => {
    set({ loading: true, error: null });
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          image_base64: product.image_base64,
          in_stock: product.inStock
        })
        .eq('id', product.id)
        .eq('vendor_id', vendorId);

      if (updateError) throw updateError;
      get().invalidateCache();
      await get().fetchVendors(true);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (vendorId: string, productId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('vendor_id', vendorId);

      if (error) throw error;
      get().invalidateCache();
      await get().fetchVendors(true);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addReview: async (productId: string, review: { profile_id: string; rating: number; comment: string }) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          profile_id: review.profile_id,
          rating: review.rating,
          comment: review.comment
        })
        .select(`
          *,
          profiles!reviews_profile_id_fkey (
            name
          )
        `)
        .single();

      if (error) throw error;
      get().invalidateCache();
      await get().fetchVendors(true);
      return { id: data.id };
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateReview: async (productId: string, review: { id: string; profile_id: string; rating: number; comment: string }) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          rating: review.rating,
          comment: review.comment
        })
        .eq('id', review.id)
        .eq('product_id', productId);

      if (error) throw error;
      get().invalidateCache();
      await get().fetchVendors(true);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteReview: async (reviewId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      get().invalidateCache();
      await get().fetchVendors(true);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));