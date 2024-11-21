import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Vendor } from '../../types';
import { useVendorStore } from '../../store/vendorStore';
import { ImageUpload } from '../shared/ImageUpload';

interface StoreProfileEditProps {
  vendor: Vendor;
  onClose: () => void;
  language: 'en' | 'ar';
  onSuccess: () => void;
}

export function StoreProfileEdit({ vendor, onClose, language, onSuccess }: StoreProfileEditProps) {
  const { updateVendor } = useVendorStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: vendor.name,
    description: vendor.description,
    category: vendor.category,
    image: vendor.image,
    image_base64: vendor.image_base64 || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateVendor({
        ...vendor,
        ...formData
      });

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
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {language === 'en' ? 'Edit Store Details' : 'تعديل تفاصيل المتجر'}
        </h2>

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
              onImageChange={(base64) => setFormData({ 
                ...formData, 
                image_base64: base64,
                image: base64
              })}
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
              {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}