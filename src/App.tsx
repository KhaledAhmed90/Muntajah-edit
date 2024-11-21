import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './components/Home/HomePage';
import { VendorProducts } from './components/VendorProducts';
import { ProductModal } from './components/ProductModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { VendorDashboard } from './components/VendorDashboard';
import { UserProfile } from './components/UserProfile';
import { FavoritesList } from './components/FavoritesList';
import { SplashScreen } from './components/SplashScreen';
import { useAuthStore } from './store/authStore';
import { useVendorStore } from './store/vendorStore';
import { useFavoriteStore } from './store/favoriteStore';
import { Vendor, Product, UserRole } from './types';
import { useResponsive } from './hooks/useResponsive';
import { useBackHandler } from './hooks/useBackHandler';
import { useSwipeBack } from './hooks/useSwipeBack';
import { useNavigationStack } from './hooks/useNavigationStack';
import './styles/responsive.css';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const { user } = useAuthStore();
  const { vendors, fetchVendors } = useVendorStore();
  const { fetchFavorites } = useFavoriteStore();
  const { isMobile, isTablet, isPortrait } = useResponsive();
  const { navigate, goBack, getCurrentView, canGoBack } = useNavigationStack('home');

  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([
        useAuthStore.getState().initializeAuth(),
        fetchVendors(),
        user && fetchFavorites(),
      ]);
    };

    initializeApp();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
      return true;
    }
    if (selectedVendor) {
      setSelectedVendor(null);
      return true;
    }
    if (canGoBack) {
      return goBack();
    }
    return false;
  };

  // Handle back navigation
  useBackHandler({
    onBack: handleBack,
    enabled: true,
    confirmExit: !canGoBack && getCurrentView().view === 'home',
    confirmMessage: language === 'en' ? 'Press back again to exit' : 'اضغط مرة أخرى للخروج'
  });

  // Handle swipe back gesture
  useSwipeBack({
    onBack: handleBack,
    enabled: isMobile,
    confirmExit: !canGoBack && getCurrentView().view === 'home',
    confirmMessage: language === 'en' ? 'Swipe again to exit' : 'اسحب مرة أخرى للخروج'
  });

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
    document.documentElement.dir = language === 'ar' ? 'ltr' : 'rtl';
    document.documentElement.lang = language === 'ar' ? 'en' : 'ar';
  };

  const handleAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData: {
    id: string;
    role: UserRole;
    vendorId?: string;
  }) => {
    setIsAuthModalOpen(false);
    if (authMode === 'register') {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleViewChange = (view: string) => {
    navigate(view);
    setSelectedVendor(null);
    setSelectedProduct(null);
  };

  const renderContent = () => {
    if (showSplash) {
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    const currentView = getCurrentView().view;

    return (
      <Layout
        language={language}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onLanguageToggle={handleLanguageToggle}
        onAuthClick={handleAuth}
        currentView={currentView}
        onViewChange={handleViewChange}
        onHomeClick={() => handleViewChange('home')}
        isMobile={isMobile}
        isTablet={isTablet}
      >
        <AnimatePresence mode="wait">
          {user?.role === 'admin' ? (
            <AdminDashboard
              key="admin"
              vendors={vendors}
              language={language}
              onHomeClick={() => handleViewChange('home')}
            />
          ) : user?.role === 'vendor' && currentView === 'store' ? (
            <VendorDashboard key="vendor" language={language} />
          ) : currentView === 'profile' ? (
            <UserProfile
              key="profile"
              language={language}
              onEditProfile={() => {}}
            />
          ) : currentView === 'favorites' ? (
            <FavoritesList
              key="favorites"
              onProductClick={setSelectedProduct}
              language={language}
            />
          ) : selectedVendor ? (
            <VendorProducts
              key="vendor-products"
              vendor={selectedVendor}
              onBack={() => setSelectedVendor(null)}
              onProductClick={setSelectedProduct}
              language={language}
            />
          ) : (
            <HomePage
              key="home"
              language={language}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onVendorClick={setSelectedVendor}
              isMobile={isMobile}
              isTablet={isTablet}
              isPortrait={isPortrait}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProduct && (
            <ProductModal
              key="product-modal"
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              language={language}
              isMobile={isMobile}
            />
          )}

          {isAuthModalOpen && (
            <AuthModal
              key="auth-modal"
              mode={authMode}
              onClose={() => setIsAuthModalOpen(false)}
              onSuccess={handleAuthSuccess}
              language={language}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>
      </Layout>
    );
  };

  return renderContent();
}