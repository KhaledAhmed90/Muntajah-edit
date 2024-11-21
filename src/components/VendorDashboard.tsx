import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { ProductForm } from './ProductForm';
import { useVendorStore } from '../store/vendorStore';
import { useVendorData } from '../hooks/useVendorData';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { VendorStats } from './VendorDashboard/VendorStats';
import { ProductList } from './VendorDashboard/ProductList';
import { StoreProfile } from './VendorDashboard/StoreProfile';
import { StoreProfileEdit } from './VendorDashboard/StoreProfileEdit';

interface VendorDashboardProps {
  language: 'en' | 'ar';
}

export function VendorDashboard({ language }: VendorDashboardProps) {
  const { vendor, loading, error } = useVendorData();
  const { addProduct, updateProduct, deleteProduct } = useVendorStore();
  const [showProductForm, setShowProductForm] = useState(false);
  const [showStoreEdit, setShowStoreEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

        if (loading) {
          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6">
                <LoadingSpinner size="lg" />
              </div>
            </div>
          );
        }
  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!vendor) {
    return null;
  }

const handleAddProduct = async (vendorId: string, newProduct: Product) => {
    try {
      await addProduct(vendorId, newProduct);
      setShowProductForm(false);
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const handleEditProduct = async (vendorId: string, updatedProduct: Product) => {
    try {
      await updateProduct(vendorId, updatedProduct);
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm(language === 'en' 
      ? 'Are you sure you want to delete this product?' 
      : 'هل أنت متأكد من حذف هذا المنتج؟'
    )) {
      try {
        await deleteProduct(vendor.id, productId);
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Store Management' : 'إدارة المتجر'}
        </h2>
        <button
          onClick={() => setShowProductForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'en' ? 'Add Product' : 'إضافة منتج'}</span>
        </button>
      </div>

      <StoreProfile 
        vendor={vendor} 
        language={language} 
        onEdit={() => setShowStoreEdit(true)}
      />
      <VendorStats products={vendor.products} language={language} />
      <ProductList
        products={vendor.products}
        language={language}
        onEdit={setEditingProduct}
        onDelete={handleDeleteProduct}
      />

      {(showProductForm || editingProduct) && (
        <ProductForm
          vendorId={vendor.id}
          product={editingProduct}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          language={language}
        />
      )}

      {showStoreEdit && (
        <StoreProfileEdit
          vendor={vendor}
          onClose={() => setShowStoreEdit(false)}
          language={language}
          onSuccess={() => setShowStoreEdit(false)}
        />
      )}
    </div>
  );
}