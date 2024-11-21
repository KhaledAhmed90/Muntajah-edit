import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Users, Search, Filter, ArrowLeft, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vendor, UserRole, Product } from '../types';
import { VendorForm } from './VendorForm';
import { ProductForm } from './ProductForm';
import { UserManagementModal } from './UserManagementModal';
import { VendorConversionForm } from './VendorConversionForm';
import { useVendorStore } from '../store/vendorStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { AdminProductList } from './AdminProductList';
import { AdminNavigation } from './AdminNavigation';
import { LoadingSpinner } from './shared/LoadingSpinner';

interface AdminDashboardProps {
  vendors: Vendor[];
  language: 'en' | 'ar';
  onHomeClick: () => void;
}

export function AdminDashboard({ vendors, language, onHomeClick }: AdminDashboardProps) {
  const [view, setView] = useState<'vendors' | 'users' | 'products'>('vendors');
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editingProduct, setEditingProduct] = useState<{ product: Product; vendorId: string } | null>(null);
  const [convertingUser, setConvertingUser] = useState<{ id: string; name: string } | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const { addVendor, updateVendor, deleteVendor, addProduct, updateProduct, deleteProduct } = useVendorStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleAddVendor = async (newVendor: Vendor) => {
    try {
      await addVendor(newVendor);
      setShowVendorForm(false);
      showMessage(language === 'en' ? 'Vendor added successfully!' : 'تمت إضافة البائع بنجاح!');
    } catch (err) {
      console.error('Failed to add vendor:', err);
    }
  };

  const handleEditVendor = async (updatedVendor: Vendor) => {
    try {
      await updateVendor(updatedVendor);
      setEditingVendor(null);
      showMessage(language === 'en' ? 'Vendor updated successfully!' : 'تم تحديث البائع بنجاح!');
    } catch (err) {
      console.error('Failed to update vendor:', err);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this vendor?' : 'هل أنت متأكد من حذف هذا البائع؟')) {
      try {
        await deleteVendor(vendorId);
        showMessage(language === 'en' ? 'Vendor deleted successfully!' : 'تم حذف البائع بنجاح!');
      } catch (err) {
        console.error('Failed to delete vendor:', err);
      }
    }
  };

  const handleAddProduct = async (vendorId: string, newProduct: any) => {
    try {
      await addProduct(vendorId, newProduct);
      setShowProductForm(false);
      setSelectedVendor(null);
      showMessage(language === 'en' ? 'Product added successfully!' : 'تمت إضافة المنتج بنجاح!');
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const handleEditProduct = async (vendorId: string, updatedProduct: Product) => {
    try {
      await updateProduct(vendorId, updatedProduct);
      setEditingProduct(null);
      showMessage(language === 'en' ? 'Product updated successfully!' : 'تم تحديث المنتج بنجاح!');
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const handleDeleteProduct = async (vendorId: string, productId: string) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this product?' : 'هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await deleteProduct(vendorId, productId);
        showMessage(language === 'en' ? 'Product deleted successfully!' : 'تم حذف المنتج بنجاح!');
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this user?' : 'هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
        await fetchUsers();
        showMessage(language === 'en' ? 'User deleted successfully!' : 'تم حذف المستخدم بنجاح!');
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
      await fetchUsers();
      showMessage(language === 'en' ? 'User role updated successfully!' : 'تم تحديث دور المستخدم بنجاح!');
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  const handleVendorConversionSuccess = async () => {
    await Promise.all([
      fetchUsers(),
      useVendorStore.getState().fetchVendors()
    ]);
    showMessage(language === 'en' ? 'User successfully converted to vendor!' : 'تم تحويل المستخدم إلى بائع بنجاح!');
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      <AnimatePresence mode="wait">
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-100 border border-green-200 text-green-700 px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AdminNavigation
        currentView={view}
        onViewChange={(v) => setView(v as 'vendors' | 'users' | 'products')}
        language={language}
        onHomeClick={onHomeClick}
      />

      <AnimatePresence mode="wait">
        {view === 'vendors' && (
          <motion.div
            key="vendors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {language === 'en' ? 'Vendor Management' : 'إدارة البائعين'}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVendorForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">{language === 'en' ? 'Add Vendor' : 'إضافة بائع'}</span>
              </motion.button>
            </div>

            <div className="grid gap-6">
              {vendors.map(vendor => (
                <motion.div
                  key={vendor.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{vendor.name}</h3>
                        <p className="text-gray-600 mt-1">{vendor.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500">{vendor.location}</span>
                          <span className="text-sm text-gray-500">{vendor.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingVendor(vendor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteVendor(vendor.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setShowProductForm(true);
                          }}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Package className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-4">
                        {language === 'en' ? 'Products' : 'المنتجات'} ({vendor.products.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vendor.products.map(product => (
                          <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{product.name}</span>
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setEditingProduct({ product, vendorId: vendor.id })}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteProduct(vendor.id, product.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {product.description}
                            </p>
                            <span className="text-purple-600 font-medium mt-2 block">
                              {product.price} SAR
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminProductList
              vendors={vendors}
              language={language}
              onEdit={(product, vendorId) => setEditingProduct({ product, vendorId })}
              onDelete={handleDeleteProduct}
            />
          </motion.div>
        )}

        {view === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {language === 'en' ? 'User Management' : 'إدارة المستخدمين'}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={language === 'en' ? 'Search users...' : 'البحث عن المستخدمين...'}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserManagement(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">{language === 'en' ? 'Add User' : 'إضافة مستخدم'}</span>
                  </motion.button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        {language === 'en' ? 'Name' : 'الاسم'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        {language === 'en' ? 'Email/Phone' : 'البريد/الهاتف'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        {language === 'en' ? 'Role' : 'الدور'}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        {language === 'en' ? 'Actions' : 'الإجراءات'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email || user.phone}</td>
                        <td className="py-3 px-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value as UserRole)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="customer">{language === 'en' ? 'Customer' : 'عميل'}</option>
                            <option value="vendor">{language === 'en' ? 'Vendor' : 'بائع'}</option>
                            <option value="admin">{language === 'en' ? 'Admin' : 'مدير'}</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {user.role === 'customer' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setConvertingUser({ id: user.id, name: user.name })}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title={language === 'en' ? 'Convert to Vendor' : 'تحويل إلى بائع'}
                              >
                                <Store className="w-5 h-5" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVendorForm && (
          <VendorForm
            onSubmit={handleAddVendor}
            onClose={() => setShowVendorForm(false)}
            language={language}
          />
        )}

        {editingVendor && (
          <VendorForm
            vendor={editingVendor}
            onSubmit={handleEditVendor}
            onClose={() => setEditingVendor(null)}
            language={language}
          />
        )}

        {showProductForm && selectedVendor && (
          <ProductForm
            vendorId={selectedVendor.id}
            onSubmit={handleAddProduct}
            onClose={() => {
              setShowProductForm(false);
              setSelectedVendor(null);
            }}
            language={language}
          />
        )}

        {editingProduct && (
          <ProductForm
            vendorId={editingProduct.vendorId}
            product={editingProduct.product}
            onSubmit={(vendorId, product) => handleEditProduct(vendorId, product)}
            onClose={() => setEditingProduct(null)}
            language={language}
          />
        )}

        {showUserManagement && (
          <UserManagementModal
            onClose={() => setShowUserManagement(false)}
            language={language}
          />
        )}

        {convertingUser && (
          <VendorConversionForm
            userId={convertingUser.id}
            userName={convertingUser.name}
            onClose={() => setConvertingUser(null)}
            onSuccess={handleVendorConversionSuccess}
            language={language}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}