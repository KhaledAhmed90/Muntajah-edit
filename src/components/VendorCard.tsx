import React from 'react';
import { Star, Phone, MapPin, Heart } from 'lucide-react';
import { Vendor } from '../types';
import { useAuthStore } from '../store/authStore';

interface VendorCardProps {
  vendor: Vendor;
  onClick: (vendor: Vendor) => void;
  language: 'en' | 'ar';
  onToggleFavorite?: (vendorId: string) => void;
  isFavorite?: boolean;
}

export function VendorCard({ vendor, onClick, language, onToggleFavorite, isFavorite }: VendorCardProps) {
  const { user } = useAuthStore();

  const handlePhoneClick = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleLocationClick = (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps?q=${vendor.coordinates.lat},${vendor.coordinates.lng}`, '_blank');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(vendor.id);
    }
  };

  return (
    <div
      onClick={() => onClick(vendor)}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer group relative"
    >
      {user && onToggleFavorite && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 transform hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${
              isFavorite
                ? 'text-red-500 fill-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>
      )}
      <div className="relative h-48">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
          {vendor.name}
        </h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{vendor.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-medium">
            {vendor.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {vendor.products.length} {language === 'en' ? 'products' : 'منتج'}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={(e) => handlePhoneClick(e, vendor.phone)}
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 transition-colors duration-200 font-medium"
          >
            <Phone className="w-4 h-4" />
            <span>{vendor.phone}</span>
          </button>
          <button
            onClick={(e) => handleLocationClick(e, vendor)}
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 transition-colors duration-200 font-medium"
          >
            <MapPin className="w-4 h-4" />
            <span>{language === 'en' ? 'Map' : 'الخريطة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}