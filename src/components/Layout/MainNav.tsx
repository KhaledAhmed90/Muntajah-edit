import React from 'react';
import { Home, Package, Heart, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { useFavoriteStore } from '../../store/favoriteStore';

interface MainNavProps {
  language: 'en' | 'ar';
  currentView: string;
  onViewChange: (view: string) => void;
  isMobile?: boolean;
}

export function MainNav({
  language,
  currentView,
  onViewChange,
  isMobile,
}: MainNavProps) {
  const { user } = useAuthStore();
  const { fetchFavorites } = useFavoriteStore();

  // Don't show navigation for vendor when in store view
  if (user?.role === 'vendor' && currentView === 'store') {
    return null;
  }

  const navItems = [
    {
      id: 'home',
      icon: <Home className="w-5 h-5" />,
      label: language === 'en' ? 'Home' : 'الرئيسية',
    },
    ...(user
      ? [
          {
            id: 'favorites',
            icon: <Heart className="w-5 h-5" />,
            label: language === 'en' ? 'Favorites' : 'المفضلة',
            function: fetchFavorites,
          },
          {
            id: 'orders',
            icon: <Package className="w-5 h-5" />,
            label: language === 'en' ? 'Orders' : 'الطلبات',
          },
          {
            id: 'profile',
            icon: <User className="w-5 h-5" />,
            label: language === 'en' ? 'Profile' : 'حسابي',
          },
        ]
      : []),
  ];

  if (isMobile) {
    return (
      <nav className="bg-white border-t fixed bottom-0 left-0 right-0 z-20 safe-bottom">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange(item.id)}
              
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b sticky top-16 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-4">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}
