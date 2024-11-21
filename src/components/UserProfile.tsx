import React, { useState } from 'react';
import { UserCircle, Mail, Phone, Edit, Camera, Building2, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { CustomerProfileEdit } from './CustomerProfileEdit';
import { VendorProfileEdit } from './VendorProfileEdit';
import { useLocations } from '../hooks/useLocations';

interface UserProfileProps {
  language: 'en' | 'ar';
  onEditProfile: () => void;
}

export function UserProfile({ language, onEditProfile }: UserProfileProps) {
  const { user } = useAuthStore();
  const { getCityName, getDistrictName } = useLocations(language);
  const [isHovered, setIsHovered] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (!user) return null;

  const handleEditSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {language === 'en' ? 'Profile updated successfully!' : 'تم تحديث الملف الشخصي بنجاح!'}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
        <div className="flex flex-col items-center">
          <div 
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
              {user.avatar_base64 ? (
                <img 
                  src={user.avatar_base64} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-20 h-20 text-purple-600" />
              )}
            </div>
            {user.role === 'customer' && (
              <div 
                className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Camera className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h2>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mt-2">
            {user.role === 'customer' 
              ? (language === 'en' ? 'Customer' : 'عميل')
              : (language === 'en' ? 'Vendor' : 'بائع')}
          </span>
        </div>

        <div className="space-y-4">
          {user.email && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{user.phone}</span>
            </div>
          )}
          {user.city && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">
                {getCityName(user.city)}
                {user.district && ` - ${getDistrictName(user.district)}`}
              </span>
            </div>
          )}
          {user.role === 'vendor' && user.vendor && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Building2 className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{user.vendor.name}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowEditProfile(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 transform hover:scale-[1.02]"
        >
          <Edit className="w-5 h-5" />
          <span>{language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}</span>
        </button>
      </div>

      {showEditProfile && (
        user.role === 'vendor' ? (
          <VendorProfileEdit
            onClose={() => setShowEditProfile(false)}
            language={language}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <CustomerProfileEdit
            onClose={() => setShowEditProfile(false)}
            language={language}
            onSuccess={handleEditSuccess}
          />
        )
      )}
    </div>
  );
}