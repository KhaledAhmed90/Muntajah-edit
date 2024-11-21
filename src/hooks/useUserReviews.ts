import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Review } from '../types';
import { useAuthStore } from '../store/authStore';

export function useUserReviews() {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserReviews() {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            products (
              name,
              vendor_id,
              vendors (
                name
              )
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const transformedReviews = data.map((review: any) => ({
          ...review,
          productName: review.products.name,
          vendorName: review.products.vendors.name,
          date: new Date(review.created_at).toISOString()
        }));

        setReviews(transformedReviews);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserReviews();
  }, [user]);

  return { reviews, loading, error };
}