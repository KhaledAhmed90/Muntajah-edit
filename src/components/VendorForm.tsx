import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Vendor } from '../types';

interface VendorFormProps {
  vendor?: Vendor;
  onSubmit: (vendor: Vendor) => void;
  onClose: () => void;
  language: 'en' | 'ar';
}

export function VendorForm({ vendor, onSubmit, onClose, language }: VendorFormProps) {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    category: vendor?.category || 'food',
    location: vendor?.location || '',
    phone: vendor?.phone || '',
    description: vendor?.description || '',
    image: vendor?.image || '',
    coordinates: vendor?.coordinates || { lat: 24.7136, lng: 46.6753 }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: vendor?.id || '',
      ...formData,
      rating: vendor?.rating || 0,
      products: vendor?.products || []
    });
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
          {vendor
            ? (language === 'en' ? 'Edit Vendor' : 'تعديل البائع')
            : (language === 'en' ? 'Add New Vendor' : 'إضافة بائع جديد')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Vendor Name' : 'اسم البائع'}
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
              {language === 'en' ? 'Category' : 'الفئة'}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="food">{language === 'en' ? 'Food' : 'طعام'}</option>
              <option value="clothing">{language === 'en' ? 'Clothing' : 'ملابس'}</option>
              <option value="crafts">{language === 'en' ? 'Crafts' : 'حرف يدوية'}</option>
              <option value="accessories">{language === 'en' ? 'Accessories' : 'إكسسوارات'}</option>
              <option value="home-decor">{language === 'en' ? 'Home Decor' : 'ديكور منزلي'}</option>
              <option value="beauty">{language === 'en' ? 'Beauty' : 'تجميل'}</option>
            </select>
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
              {language === 'en' ? 'Phone' : 'رقم الهاتف'}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Image URL' : 'رابط الصورة'}
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              {vendor
                ? (language === 'en' ? 'Save Changes' : 'حفظ التغييرات')
                : (language === 'en' ? 'Add Vendor' : 'إضافة البائع')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}