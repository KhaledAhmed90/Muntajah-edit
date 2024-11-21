import React, { useState } from 'react';
import { Edit, Trash2, Search, Filter } from 'lucide-react';
import { Vendor, Product } from '../types';

interface AdminProductListProps {
  vendors: Vendor[];
  language: 'en' | 'ar';
  onEdit: (product: Product, vendorId: string) => void;
  onDelete: (vendorId: string, productId: string) => void;
}

export function AdminProductList({ vendors, language, onEdit, onDelete }: AdminProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>('name');

  const allProducts = vendors.flatMap(vendor => 
    vendor.products.map(product => ({
      ...product,
      vendorName: vendor.name,
      vendorId: vendor.id,
      category: vendor.category
    }))
  );

  const filteredProducts = allProducts.filter(product =>
    (selectedCategory === 'all' || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.vendorName.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        const aRating = a.reviews.reduce((acc, r) => acc + r.rating, 0) / (a.reviews.length || 1);
        const bRating = b.reviews.reduce((acc, r) => acc + r.rating, 0) / (b.reviews.length || 1);
        return bRating - aRating;
      default:
        return 0;
    }
  });

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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {language === 'en' ? 'Product Management' : 'إدارة المنتجات'}
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'en' ? 'Search products...' : 'البحث عن المنتجات...'}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Object.entries(categories).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="name">{language === 'en' ? 'Sort by Name' : 'ترتيب حسب الاسم'}</option>
              <option value="price-low">{language === 'en' ? 'Price: Low to High' : 'السعر: من الأقل إلى الأعلى'}</option>
              <option value="price-high">{language === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى إلى الأقل'}</option>
              <option value="rating">{language === 'en' ? 'Highest Rated' : 'الأعلى تقييماً'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-gray-50 rounded-lg overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    {language === 'en' ? 'Out of Stock' : 'غير متوفر'}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(product, product.vendorId)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.vendorId, product.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600 font-medium">
                    {product.price} SAR
                  </span>
                  <span className="text-sm text-gray-500">
                    {language === 'en' ? 'Vendor:' : 'البائع:'} {product.vendorName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}