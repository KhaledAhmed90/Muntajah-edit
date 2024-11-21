import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { useFavoriteStore } from '../store/favoriteStore';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { useAuthStore } from '../store/authStore';

interface FavoritesListProps {
  onProductClick: (product: Product) => void;
  language: 'en' | 'ar';
}

export function FavoritesList({ onProductClick, language }: FavoritesListProps) {
  const { user } = useAuthStore();
  const { favorites, loading, error, fetchFavorites } = useFavoriteStore();

  // Fetch fresh data when component mounts
  useEffect(() => {
    if (user) {
      fetchFavorites(true);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-600">
        {language === 'en' 
          ? 'Please log in to view your favorites' 
          : 'الرجاء تسجيل الدخول لعرض المفضلة'}
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {language === 'en' ? 'Failed to load favorites' : 'فشل في تحميل المفضلة'}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        {language === 'en' 
          ? 'No favorite products yet' 
          : 'لا توجد منتجات مفضلة حتى الآن'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {language === 'en' ? 'My Favorites' : 'المفضلة'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {favorites.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard
                product={product}
                onClick={onProductClick}
                language={language}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}