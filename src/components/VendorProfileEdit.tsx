import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { ImageUpload } from './shared/ImageUpload';
import { useLocations } from '../hooks/useLocations';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface VendorProfileEditProps {
  onClose: () => void;
  language: 'en' | 'ar';
  onSuccess: () => void;
}

export function VendorProfileEdit({ onClose, language, onSuccess }: VendorProfileEditProps) {
  const { user, updateProfile } = useAuthStore();
  const { cities, districts, getDistrictsByCity, loading: locationsLoading } = useLocations(language);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar_base64: user?.avatar_base64 || '',
    city: user?.city || '',
    district: user?.district || ''
  });

  // Get districts for selected city
  const availableDistricts = formData.city ? getDistrictsByCity(formData.city) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update only personal profile data
      await updateProfile({
        id: user?.id || '',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar_base64: formData.avatar_base64,
        city: formData.city,
        district: formData.district,
        role: 'vendor'
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (locationsLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6">
          <p>{language === 'en' ? 'Loading...' : 'جاري التحميل...'}</p>
        </div>
      </div>
    );
  }

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
          {language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <ImageUpload
              currentImage={formData.avatar_base64}
              onImageChange={(base64) => setFormData({ ...formData, avatar_base64: base64 })}
              size="lg"
              language={language}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
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
              {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
            </label>
            <PhoneInput
              country={'ye'}
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone: `+${phone}` })}
              inputClass="w-full pl-[52px] pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              containerClass="phone-input"
              buttonClass="phone-input-button"
              dropdownClass="phone-input-dropdown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'City' : 'المدينة'}
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value, district: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">{language === 'en' ? 'Select City' : 'اختر المدينة'}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {language === 'ar' ? city.name_ar : city.name_en}
                </option>
              ))}
            </select>
          </div>

          {formData.city && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'District' : 'المنطقة'}
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">{language === 'en' ? 'Select District' : 'اختر المنطقة'}</option>
                {availableDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {language === 'ar' ? district.name_ar : district.name_en}
                  </option>
                ))}
              </select>
            </div>
          )}

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