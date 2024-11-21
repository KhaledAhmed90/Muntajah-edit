import React, { useState, useEffect } from 'react';
import { WelcomeBanner } from './WelcomeBanner';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { VendorGrid } from './VendorGrid';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Vendor } from '../../types';
import { useVendorStore } from '../../store/vendorStore';

interface HomePageProps {
  language: 'en' | 'ar';
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onVendorClick: (vendor: Vendor) => void;
  isMobile?: boolean;
  isTablet?: boolean;
  isPortrait?: boolean;
}

export function HomePage({
  language,
  searchTerm,
  onSearchChange,
  onVendorClick,
  isMobile,
  isTablet,
  isPortrait
}: HomePageProps) {
  const { vendors, loading } = useVendorStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const totalProducts = vendors.reduce((sum, vendor) => sum + vendor.products.length, 0);

  const filteredVendors = vendors.filter(vendor =>
    (selectedCategory === 'all' || vendor.category === selectedCategory) &&
    (vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vendor.products.some(product =>
       product.name.toLowerCase().includes(searchTerm.toLowerCase())
     ))
  );

        if (loading) {
          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6">
                <LoadingSpinner size="lg" />
              </div>
            </div>
          );
        }

  return (
    <div className="space-y-6">
      <WelcomeBanner
        language={language}
        vendorCount={vendors.length}
        productCount={totalProducts}
      />

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        language={language}
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        language={language}
      />

      <VendorGrid
        vendors={filteredVendors}
        onVendorClick={onVendorClick}
        language={language}
      />
    </div>
  );
}