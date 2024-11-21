import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useAuthStore } from '../store/authStore';

interface UseProductDataReturn {
  productData: Product | null;
  userProfile: { id: string } | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export function useProductData(productId: string): UseProductDataReturn {
  const { user } = useAuthStore();
  const [productData, setProductData] = useState<Product | null>(null);
  const [userProfile, setUserProfile] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!user) return null;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      return profile;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  const fetchProductData = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          reviews (
            *,
            profiles!reviews_profile_id_fkey (
              id,
              name
            )
          )
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          inStock: data.in_stock,
          reviews: data.reviews.map((review: any) => ({
            id: review.id,
            userId: review.profiles.id,
            userName: review.profiles.name,
            rating: review.rating,
            comment: review.comment,
            date: new Date(review.created_at).toISOString(),
          })),
        };
      }
      return null;
    } catch (err) {
      throw err;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [profile, product] = await Promise.all([
        fetchUserProfile(),
        fetchProductData()
      ]);
      
      setUserProfile(profile);
      setProductData(product);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [productId, user?.id]);

  return {
    productData,
    userProfile,
    loading,
    error,
    refreshData
  };
}