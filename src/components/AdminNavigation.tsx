import React from 'react';
import { Users, ShoppingBag, Home, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminNavigationProps {
  currentView: 'vendors' | 'products' | 'settings';
  onViewChange: (view: 'vendors' | 'products' | 'settings') => void;
  language: 'en' | 'ar';
  onHomeClick: () => void;
}

export function AdminNavigation({
  currentView,
  onViewChange,
  language,
  onHomeClick,
}: AdminNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange('vendors')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              currentView === 'vendors'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">{language === 'en' ? 'Vendors' : 'البائعون'}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              currentView === 'products'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">{language === 'en' ? 'Products' : 'المنتجات'}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              currentView === 'users'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">{language === 'en' ? 'users' : 'المستخدمين'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}