import React, { useState } from 'react';
import { Search, ShoppingBag, Globe, LogIn, UserPlus, Store, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useVendorStore } from '../store/vendorStore';
import { useFavoriteStore } from '../store/favoriteStore';

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  language: 'en' | 'ar';
  onLanguageToggle: () => void;
  onAuthClick: (mode: 'login' | 'register') => void;
  showSearch?: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
  isMobile?: boolean;
}

export function Header({
  searchTerm,
  onSearchChange,
  language,
  onLanguageToggle,
  onAuthClick,
  showSearch = true,
  currentView,
  onViewChange,
  isMobile,
}: HeaderProps) {
  const { user, signOut } = useAuthStore();
  const { fetchVendors } = useVendorStore();
  const { fetchFavorites } = useFavoriteStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchVisible(!isSearchVisible);

  const handleLogoClick = async () => {
    await Promise.all([
      fetchVendors(true),
      user && fetchFavorites(true)
    ]);
    onViewChange('home');
  };

  const menuItems = [
    ...(user?.role === 'vendor' ? [
      {
        icon: <Store className="w-4 h-4" />,
        label: currentView === 'store' 
          ? (language === 'en' ? 'Browse Market' : 'تصفح السوق')
          : (language === 'en' ? 'My Store' : 'متجري'),
        onClick: () => onViewChange(currentView === 'store' ? 'home' : 'store')
      }
    ] : []),
    ...(user ? [
      {
        label: language === 'en' ? 'Profile' : 'الملف الشخصي',
        onClick: () => onViewChange('profile')
      },
      {
        label: language === 'en' ? 'Logout' : 'تسجيل الخروج',
        onClick: signOut,
        className: 'text-red-600'
      }
    ] : [
      {
        icon: <LogIn className="w-4 h-4" />,
        label: language === 'en' ? 'Login' : 'تسجيل الدخول',
        onClick: () => onAuthClick('login')
      },
      {
        icon: <UserPlus className="w-4 h-4" />,
        label: language === 'en' ? 'Register' : 'حساب جديد',
        onClick: () => onAuthClick('register')
      }
    ])
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg sticky top-0 z-20 safe-top"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {language === 'ar' ? 'مُنتِجة' : 'Muntajah'}
            </h1>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {showSearch && onSearchChange && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                className="relative max-w-xs w-full"
              >
                <input
                  type="text"
                  placeholder={language === 'en' ? "Search..." : "بحث..."}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLanguageToggle}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title={language === 'en' ? "Switch to Arabic" : "Switch to English"}
            >
              <Globe className="w-5 h-5 text-gray-600" />
            </motion.button>

            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={item.onClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  item.className || 'hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            {showSearch && onSearchChange && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLanguageToggle}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-5 h-5 text-gray-600" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchVisible && isMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={language === 'en' ? "Search..." : "بحث..."}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-3 border-t"
            >
              <div className="py-2 space-y-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      item.className || 'hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}