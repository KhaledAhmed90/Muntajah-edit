import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Product } from '../types';
import { ImageUpload } from './shared/ImageUpload';

interface ProductFormProps {
  vendorId: string;
  product?: Product;
  onSubmit: (vendorId: string, product: Product) => void;
  onClose: () => void;
    onSuccess?: () => Promise<void>; // إضافة دالة للتحديث
  language: 'en' | 'ar';
}

export function ProductForm({ vendorId, product, onSubmit, onClose, language }: ProductFormProps) {
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ? String(product.price) : '', // تحويل السعر إلى نص إذا كان موجوداً
    inStock: product?.inStock ?? true,
    reviews: product?.reviews || [],
    image: product?.image || '',
    image_base64: product?.image_base64 || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // السماح بالقيمة الفارغة أو الأرقام فقط
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, price: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        image: formData.image_base64 || formData.image // Use base64 if available, fallback to URL
      };

      await onSubmit(vendorId, productData);

            // تحديث البيانات بعد النجاح
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
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

        <h2 className="text-2xl font-bold mb-6">
          {product
            ? (language === 'en' ? 'Edit Product' : 'تعديل المنتج')
            : (language === 'en' ? 'Add New Product' : 'إضافة منتج جديد')}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Product Image' : 'صورة المنتج'}
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
              {language === 'en' ? 'Product Name' : 'اسم المنتج'}
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
              {language === 'en' ? 'Price (SAR)' : 'السعر (ريال)'}
            </label>
            <input
              type="text" // تغيير النوع إلى text بدلاً من number
              inputMode="decimal" // إضافة inputMode للحصول على لوحة مفاتيح رقمية على الموبايل
              value={formData.price}
              onChange={handlePriceChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
              {language === 'en' ? 'In Stock' : 'متوفر'}
            </label>
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
              {loading ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {product
                ? (language === 'en' ? 'Save Changes' : 'حفظ التغييرات')
                : (language === 'en' ? 'Add Product' : 'إضافة المنتج')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}