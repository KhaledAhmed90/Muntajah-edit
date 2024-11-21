import React, { useState } from 'react';
import { X, Camera, Phone, MapPin } from 'lucide-react';
import { Vendor } from '../types';
import { useVendorStore } from '../store/vendorStore';

interface VendorProfileProps {
  vendor: Vendor;
  onClose: () => void;
  language: 'en' | 'ar';
}

export function VendorProfile({ vendor, onClose, language }: VendorProfileProps) {
  const { updateVendor } = useVendorStore();
  const [formData, setFormData] = useState({
    name: vendor.name,
    phone: vendor.phone,
    location: vendor.location,
    description: vendor.description,
    image: vendor.image,
    coordinates: vendor.coordinates
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVendor({
        ...vendor,
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update vendor profile:', error);
    }
  };

  const handlePhoneClick = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleLocationClick = (coordinates: { lat: number; lng: number }) => {
    window.open(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={formData.image}
                alt={formData.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                <Camera className="w-5 h-5" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => handlePhoneClick(formData.phone)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>{formData.phone}</span>
            </button>
            <button
              type="button"
              onClick={() => handleLocationClick(formData.coordinates)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span>{formData.location}</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Business Name' : 'اسم المتجر'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Location' : 'الموقع'}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Description' : 'الوصف'}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}