import React from 'react';
import { Product } from '../types';
import { Star, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useFavoriteStore } from '../store/favoriteStore';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  language: 'en' | 'ar';
}

export function ProductCard({ product, onClick, language }: ProductCardProps) {
  const { user } = useAuthStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const isProductFavorite = isFavorite(product.id);

  const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length || 0;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      if (isProductFavorite) {
        await removeFavorite(product.id);
      } else {
        await addFavorite(product.id);
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  return (
    <motion.div
      onClick={() => onClick(product)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {user && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isProductFavorite
                ? 'text-red-500 fill-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </motion.button>
      )}

      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.inStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            {language === 'en' ? 'Out of Stock' : 'غير متوفر'}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-purple-600">
            {product.price} {language === 'en' ? 'YER' : 'ريال'}
          </span>
          <div className="flex items-center gap-1">
            {averageRating > 0 && (
              <>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-600">{averageRating.toFixed(1)}</span>
              </>
            )}
            <span className="text-sm text-gray-500">
              ({product.reviews.length})
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}