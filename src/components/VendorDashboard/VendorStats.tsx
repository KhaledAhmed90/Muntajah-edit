import React from 'react';
import { Package, Star, TrendingUp } from 'lucide-react';
import { Product } from '../../types';

interface VendorStatsProps {
  products: Product[];
  language: 'en' | 'ar';
}

export function VendorStats({ products, language }: VendorStatsProps) {
  const analytics = {
    totalProducts: products.length,
    totalReviews: products.reduce((acc, product) => acc + product.reviews.length, 0),
    averageRating: products.reduce((acc, product) => {
      const productRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / (product.reviews.length || 1);
      return acc + productRating;
    }, 0) / (products.length || 1)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Total Products' : 'إجمالي المنتجات'}
          </h3>
          <Package className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900">{analytics.totalProducts}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Total Reviews' : 'إجمالي التقييمات'}
          </h3>
          <Star className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-3xl font-bold text-gray-900">{analytics.totalReviews}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Average Rating' : 'متوسط التقييم'}
          </h3>
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {analytics.averageRating.toFixed(1)}
        </p>
      </div>
    </div>
  );
}