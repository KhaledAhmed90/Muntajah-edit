import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  language: 'en' | 'ar';
}

export function SearchBar({ searchTerm, onSearchChange, language }: SearchBarProps) {
  return (
    <div className="relative max-w-xl w-full mx-auto mb-8">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={
          language === 'en'
            ? 'Search for vendors, products, or categories...'
            : 'ابحث عن البائعين أو المنتجات أو الفئات...'
        }
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
}