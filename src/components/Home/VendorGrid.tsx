import React from 'react';
import { VendorCard } from '../VendorCard';
import { Vendor } from '../../types';

interface VendorGridProps {
  vendors: Vendor[];
  onVendorClick: (vendor: Vendor) => void;
  language: 'en' | 'ar';
}

export function VendorGrid({ vendors, onVendorClick, language }: VendorGridProps) {
  if (vendors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          {language === 'en'
            ? 'No vendors found matching your search.'
            : 'لم يتم العثور على بائعين مطابقين لبحثك.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          onClick={onVendorClick}
          language={language}
        />
      ))}
    </div>
  );
}