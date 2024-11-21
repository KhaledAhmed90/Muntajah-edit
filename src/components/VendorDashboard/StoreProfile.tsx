import React from 'react';
import { Building2, MapPin, Phone, Edit } from 'lucide-react';
import { Vendor } from '../../types';

interface StoreProfileProps {
  vendor: Vendor;
  language: 'en' | 'ar';
  onEdit: () => void;
}

export function StoreProfile({ vendor, language, onEdit }: StoreProfileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <div className="absolute inset-0">
          <img
            src={vendor.image_base64 || vendor.image}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <button
          onClick={onEdit}
          className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all duration-200 flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          <span>{language === 'en' ? 'Edit Store Details' : 'تعديل تفاصيل المتجر'}</span>
        </button>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{vendor.name}</h2>
        <p className="text-gray-600 mb-4">{vendor.description}</p>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-5 h-5" />
            <span>{vendor.category}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>{vendor.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-5 h-5" />
            <span>{vendor.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}