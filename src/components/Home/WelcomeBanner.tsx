import React from 'react';
import { ShoppingBag, Star, Users } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface WelcomeBannerProps {
  language: 'en' | 'ar';
  vendorCount: number;
  productCount: number;
}

export function WelcomeBanner({ language, vendorCount, productCount }: WelcomeBannerProps) {
  const { user } = useAuthStore();

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">
          {user ? (
            language === 'en' ? 
              `Welcome back, ${user.name}!` : 
              `مرحباً بعودتك، ${user.name}!`
          ) : (
            language === 'en' ?
              'Discover Handmade Treasures' :
              'اكتشف الكنوز المصنوعة يدوياً'
          )}
        </h1>
        
        <p className="text-white/90 mb-6 max-w-2xl">
          {language === 'en' ? 
            'Explore unique handmade products from talented local artisans and home-based businesses.' :
            'استكشف منتجات يدوية فريدة من الحرفيين المحليين الموهوبين والأعمال المنزلية.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold">
                {language === 'en' ? 'Active Vendors' : 'البائعون النشطون'}
              </h3>
            </div>
            <p className="text-2xl font-bold">{vendorCount}+</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-5 h-5" />
              <h3 className="font-semibold">
                {language === 'en' ? 'Unique Products' : 'منتجات فريدة'}
              </h3>
            </div>
            <p className="text-2xl font-bold">{productCount}+</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5" />
              <h3 className="font-semibold">
                {language === 'en' ? 'Customer Reviews' : 'تقييمات العملاء'}
              </h3>
            </div>
            <p className="text-2xl font-bold">1000+</p>
          </div>
        </div>
      </div>
    </div>
  );
}