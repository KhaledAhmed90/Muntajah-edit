import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useAuthStore } from '../store/authStore';

export function useUserProducts() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProducts() {
      if (!user?.vendorId) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            reviews (
              *,
              profiles (
                name
              )
            )
          `)
          .eq('vendor_id', user.vendorId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedProducts = data.map((product: any) => ({
          ...product,
          inStock: product.in_stock,
          reviews: product.reviews.map((review: any) => ({
            ...review,
            userName: review.profiles.name,
            date: new Date(review.created_at).toISOString()
          }))
        }));

        setProducts(transformedProducts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProducts();
  }, [user?.vendorId]);

  const refreshProducts = () => {
    if (user?.vendorId) {
      fetchUserProducts();
    }
  };

  return { products, loading, error, refreshProducts };
}