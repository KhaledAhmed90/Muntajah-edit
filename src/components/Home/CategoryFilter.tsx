import React from 'react';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  language: 'en' | 'ar';
}

export function CategoryFilter({ selectedCategory, onCategoryChange, language }: CategoryFilterProps) {
  const categories = {
    all: language === 'ar' ? 'جميع الفئات' : 'All Categories',
    food: language === 'ar' ? 'طعام' : 'Food',
    clothing: language === 'ar' ? 'ملابس' : 'Clothing',
    crafts: language === 'ar' ? 'حرف يدوية' : 'Crafts',
    accessories: language === 'ar' ? 'إكسسوارات' : 'Accessories',
    'home-decor': language === 'ar' ? 'ديكور منزلي' : 'Home Decor',
    beauty: language === 'ar' ? 'تجميل' : 'Beauty'
  };

  return (
    <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
      <div className="flex items-center gap-2 text-gray-600">
        <Filter className="w-5 h-5" />
        <span className="font-medium whitespace-nowrap">
          {language === 'en' ? 'Filter by:' : 'تصفية حسب:'}
        </span>
      </div>
      
      {Object.entries(categories).map(([value, label]) => (
        <button
          key={value}
          onClick={() => onCategoryChange(value)}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            selectedCategory === value
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}