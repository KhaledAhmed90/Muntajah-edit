import React, { useState, useEffect } from 'react';
import { X, Star, Send, Edit2, Trash2, Package } from 'lucide-react';
import { Product } from '../types';
import { useVendorStore } from '../store/vendorStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { useProductData } from '../hooks/useProductData';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  language: 'en' | 'ar';
  isMobile?: boolean;
}

export function ProductModal({
  product,
  onClose,
  language,
  isMobile,
}: ProductModalProps) {
  const { addReview, updateReview, deleteReview } = useVendorStore();
  const { user } = useAuthStore();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    productData: localProduct,
    userProfile,
    loading: isLoading,
    refreshData
  } = useProductData(product.id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const existingReview = userProfile && localProduct
    ? localProduct.reviews.find((review) => review.userId === userProfile.id)
    : null;

  useEffect(() => {
    if (existingReview) {
      setNewRating(existingReview.rating);
      setNewComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) {
      setError(
        language === 'en'
          ? 'Please login to leave a review'
          : 'الرجاء تسجيل الدخول لترك تعليق'
      );
      return;
    }

    if (newComment.trim() && !isSubmitting) {
      setIsSubmitting(true);
      setError(null);
      try {
        const reviewData = {
          profile_id: userProfile.id,
          rating: newRating,
          comment: newComment.trim(),
        };

        if (existingReview) {
          await updateReview(localProduct.id, {
            ...reviewData,
            id: existingReview.id,
          });
        } else {
          await supabase.from('reviews').insert({
            product_id: localProduct.id,
            profile_id: userProfile.id,
            rating: newRating,
            comment: newComment.trim(),
          });
        }

        setIsEditing(false);
        setNewComment('');
        setNewRating(5);
        await refreshData();
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user || !userProfile) return;

    if (
      window.confirm(
        language === 'en'
          ? 'Are you sure you want to delete this review?'
          : 'هل أنت متأكد من حذف هذا التعليق؟'
      )
    ) {
      try {
        await deleteReview(reviewId);
        setIsEditing(false);
        setNewComment('');
        setNewRating(5);
        await refreshData();
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    if (existingReview) {
      setNewRating(existingReview.rating);
      setNewComment(existingReview.comment);
    }
  };

  const handleClose = async () => {
    await refreshData();
    onClose();
  };

  if (isLoading || !localProduct) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const averageRating =
    localProduct.reviews.reduce((acc, review) => acc + review.rating, 0) /
      localProduct.reviews.length || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div className="relative h-96">
            <img
              src={localProduct.image}
              alt={localProduct.name}
              className="w-full h-full object-cover rounded-t-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{localProduct.name}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-white/80">
                  ({localProduct.reviews.length}{' '}
                  {language === 'en' ? 'reviews' : 'تقييم'})
                </span>
              </div>
              <span className="text-2xl font-bold">
                ({localProduct.price} {language === 'en' ? 'SAR' : 'ريال'})
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'en' ? 'Product Details' : 'تفاصيل المنتج'}
            </h3>
            <p className="text-gray-600">{localProduct.description}</p>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Package
                  className={`w-5 h-5 ${
                    localProduct.inStock ? 'text-green-500' : 'text-red-500'
                  }`}
                />
                <span
                  className={`font-medium ${
                    localProduct.inStock ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {localProduct.inStock
                    ? language === 'en'
                      ? 'In Stock'
                      : 'متوفر'
                    : language === 'en'
                    ? 'Out of Stock'
                    : 'غير متوفر'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {language === 'en'
                  ? `Customer Reviews (${localProduct.reviews.length})`
                  : `تقييمات العملاء (${localProduct.reviews.length})`}
              </h3>
              {user && !existingReview && !isEditing && userProfile && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>
                    {language === 'en' ? 'Write a Review' : 'اكتب تقييماً'}
                  </span>
                </button>
              )}
            </div>

            {isEditing && (
              <form
                onSubmit={handleSubmitReview}
                className="mb-6 bg-gray-50 rounded-lg p-4"
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Your Rating' : 'تقييمك'}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (hoveredStar ?? newRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Your Review' : 'تعليقك'}
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {language === 'en' ? 'Cancel' : 'إلغاء'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {existingReview
                      ? language === 'en'
                        ? 'Update Review'
                        : 'تحديث التقييم'
                      : language === 'en'
                      ? 'Submit Review'
                      : 'إرسال التقييم'}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {localProduct.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">
                        {review.userName}
                        {userProfile && review.userId === userProfile.id && (
                          <span className="ml-2 text-purple-600 text-sm">
                            {language === 'en' ? '(You)' : '(أنت)'}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString(
                          language === 'en' ? 'en-US' : 'ar-SA',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </span>
                      {userProfile && review.userId === userProfile.id && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditClick()}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}