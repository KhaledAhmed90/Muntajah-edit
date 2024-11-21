import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Vendor, Product } from '../types';
import { ProductCard } from './ProductCard';
import { useAuthStore } from '../store/authStore';

interface VendorProductsProps {
  vendor: Vendor;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  language: 'en' | 'ar';
}

export function VendorProducts({ vendor, onBack, onProductClick, language }: VendorProductsProps) {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'en' ? 'Back to vendors' : 'العودة للبائعين'}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{vendor.name}</h2>
            <p className="text-white/90 max-w-2xl">{vendor.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{vendor.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{vendor.location}</span>
              <span>•</span>
              <span>{vendor.phone}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'en' ? 'Available Products' : 'المنتجات المتوفرة'}
            </h3>
            {!user && (
              <p className="mt-2 text-sm text-gray-600">
                {language === 'en' 
                  ? 'Sign in to leave reviews and ratings'
                  : 'قم بتسجيل الدخول لترك التعليقات والتقييمات'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendor.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onProductClick}
                language={language}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}