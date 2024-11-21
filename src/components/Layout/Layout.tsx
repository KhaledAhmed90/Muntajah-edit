import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../Header';
import { MainNav } from './MainNav';
import { Footer } from './Footer';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useLoading } from '../../hooks/useLoading';
import { useResponsive } from '../../hooks/useResponsive';

interface LayoutProps {
  children: React.ReactNode;
  language: 'en' | 'ar';
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onLanguageToggle: () => void;
  onAuthClick: (mode: 'login' | 'register') => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onHomeClick: () => void;
}

export function Layout({
  children,
  language,
  searchTerm,
  onSearchChange,
  onLanguageToggle,
  onAuthClick,
  currentView,
  onViewChange,
  onHomeClick,
}: LayoutProps) {
  const { isLoading } = useLoading();
  const { isMobile, isTablet, safeArea } = useResponsive();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-purple-50 ${
        language === 'ar' ? 'rtl' : 'ltr'
      }`}
      style={{
        paddingTop: safeArea.top,
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right
      }}
    >
      <Header
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        language={language}
        onLanguageToggle={onLanguageToggle}
        onAuthClick={onAuthClick}
        currentView={currentView}
        onViewChange={onViewChange}
        isMobile={isMobile}
      />
      
      <MainNav
        language={language}
        currentView={currentView}
        onViewChange={onViewChange}
        isMobile={isMobile}
      />

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading-spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <LoadingSpinner size="lg" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="responsive-container py-4 sm:py-8"
        >
          {children}
        </motion.div>
      </main>

      <Footer language={language} isMobile={isMobile} />
    </motion.div>
  );
}