import React, { useState } from 'react';
import { X, Store, MapPin, Phone } from 'lucide-react';
import { ImageUpload } from './shared/ImageUpload';
import { supabase } from '../lib/supabase';

interface VendorConversionFormProps {
  userId: string;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
  language: 'en' | 'ar';
}

export function VendorConversionForm({ userId, userName, onClose, onSuccess, language }: VendorConversionFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
    location: '',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    phone: '',
    description: '',
    image: '',
    image_base64: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create vendor record
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          name: formData.name,
          category: formData.category,
          location: formData.location,
          coordinates: formData.coordinates,
          phone: formData.phone,
          description: formData.description,
          image: formData.image_base64 || formData.image,
          image_base64: formData.image_base64
        })
        .select()
        .single();

      if (vendorError) throw vendorError;

      // Update user profile with vendor role and vendor_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: 'vendor',
          vendor_id: vendor.id
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      onSuccess();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Store className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">
            {language === 'en' 
              ? `Convert ${userName} to Vendor` 
              : `تحويل ${userName} إلى بائع`}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Store Image' : 'صورة المتجر'}
            </label>
            <ImageUpload
              currentImage={formData.image_base64 || formData.image}
              onImageChange={(base64) => setFormData({ ...formData, image_base64: base64 })}
              size="lg"
              shape="square"
              language={language}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Store Name' : 'اسم المتجر'}
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
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
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <span className="animate-spin">⌛</span>}
              {language === 'en' ? 'Convert to Vendor' : 'تحويل إلى بائع'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}