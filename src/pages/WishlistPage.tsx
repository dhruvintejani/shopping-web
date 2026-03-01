import { memo, useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { PageTransition } from '../components/animations/PageTransition';
import { StarRating } from '../components/ui/StarRating';
import { WishlistSkeleton } from '../components/ui/WishlistSkeleton';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useReducedMotion } from '../hooks/useDebounce';
import { Product } from '../types';

// Memoized Wishlist Item Component for performance
const WishlistItem = memo(function WishlistItem({
  item,
  onAddToCart,
  onRemove,
  prefersReducedMotion,
}: {
  item: Product;
  onAddToCart: (item: Product) => void;
  onRemove: (id: string) => void;
  prefersReducedMotion: boolean;
}) {
  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout={!prefersReducedMotion}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-colors"
    >
      <div className="flex flex-col sm:flex-row p-4 sm:p-5 gap-4 sm:gap-6">
        {/* Product Image */}
        <Link
          to={`/product/${item.id}`}
          className="flex-shrink-0 self-center sm:self-start"
        >
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 bg-gray-50 rounded-lg overflow-hidden group">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {item.badge && (
              <span
                className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded ${
                  item.badge === 'bestseller'
                    ? 'bg-orange-500 text-white'
                    : item.badge === 'deal'
                    ? 'bg-red-600 text-white'
                    : item.badge === 'new'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {item.badge.charAt(0).toUpperCase() + item.badge.slice(1)}
              </span>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Brand */}
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {item.brand}
          </p>

          {/* Title */}
          <Link to={`/product/${item.id}`}>
            <h3 className="text-base font-medium text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors mt-1">
              {item.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={item.rating} size="sm" />
            <span className="text-sm text-gray-500">
              ({item.reviews.toLocaleString()} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-xl font-bold text-gray-900">
              ${item.price.toFixed(2)}
            </span>
            {item.originalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ${item.originalPrice.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-emerald-600">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-2">
            {item.stock > 0 ? (
              item.stock <= 5 ? (
                <span className="text-sm text-amber-600 font-medium">
                  Only {item.stock} left in stock
                </span>
              ) : (
                <span className="text-sm text-emerald-600 font-medium">
                  ✓ In Stock
                </span>
              )
            ) : (
              <span className="text-sm text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* Actions - Desktop */}
          <div className="hidden sm:flex items-center gap-3 mt-auto pt-4">
            <button
              onClick={() => onAddToCart(item)}
              disabled={item.stock === 0}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                item.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-red-600 font-medium transition-colors flex items-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove
            </button>
          </div>
        </div>

        {/* Price & Actions Column for Desktop */}
        <div className="hidden lg:flex flex-col items-end justify-between pl-6 border-l border-gray-100 min-w-[140px]">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ${item.price.toFixed(2)}
            </p>
            {item.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                ${item.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="sm:hidden flex border-t border-gray-100">
        <button
          onClick={() => onAddToCart(item)}
          disabled={item.stock === 0}
          className={`flex-1 py-3 font-medium text-sm transition-colors border-r border-gray-100 ${
            item.stock === 0
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'text-orange-600 hover:bg-orange-50 active:bg-orange-100'
          }`}
        >
          {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="flex-1 py-3 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 active:bg-red-100 font-medium transition-colors"
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
});

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addItem);
  const addToast = useUIStore((state) => state.addToast);
  const prefersReducedMotion = useReducedMotion();
  
  // Confirmation modal states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAddAllConfirm, setShowAddAllConfirm] = useState(false);
  
  // Simulate loading state for skeleton demonstration
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product);
      addToast({
        type: 'success',
        message: `${product.title.slice(0, 30)}... added to cart`,
      });
    },
    [addToCart, addToast]
  );

  const handleRemove = useCallback(
    (productId: string) => {
      removeItem(productId);
      addToast({ type: 'info', message: 'Removed from wishlist' });
    },
    [removeItem, addToast]
  );

  const handleMoveAllToCart = useCallback(() => {
    const inStockItems = items.filter((item) => item.stock > 0);
    if (inStockItems.length === 0) {
      addToast({ type: 'error', message: 'No items in stock to add' });
      return;
    }
    inStockItems.forEach((item) => addToCart(item));
    addToast({
      type: 'success',
      message: `${inStockItems.length} item${inStockItems.length > 1 ? 's' : ''} added to cart`,
    });
    setShowAddAllConfirm(false);
  }, [items, addToCart, addToast]);

  const handleClearAll = useCallback(() => {
    clearWishlist();
    addToast({ type: 'info', message: 'Wishlist cleared' });
    setShowClearConfirm(false);
  }, [clearWishlist, addToast]);

  // Show skeleton while loading
  if (isLoading) {
    return <WishlistSkeleton count={3} />;
  }

  // Empty State
  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Your wishlist is empty
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Save items you love by clicking the heart icon on any product.
              They'll appear here so you can easily find them later.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Start Shopping
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Calculate totals
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price);
    }
    return sum;
  }, 0);
  const inStockCount = items.filter((item) => item.stock > 0).length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Wishlist
              </h1>
              <p className="text-gray-500 mt-1">
                {items.length} item{items.length !== 1 ? 's' : ''} saved
                {inStockCount < items.length && (
                  <span className="text-amber-600 ml-2">
                    ({items.length - inStockCount} out of stock)
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => inStockCount > 0 && setShowAddAllConfirm(true)}
                disabled={inStockCount === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  inStockCount === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add All to Cart
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2.5 text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
                {totalSavings > 0 && (
                  <div className="pl-6 border-l border-gray-200">
                    <p className="text-sm text-gray-500">Total Savings</p>
                    <p className="text-xl font-bold text-emerald-600">
                      ${totalSavings.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              <Link
                to="/products"
                className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
              >
                Continue Shopping
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Wishlist Items - Vertical List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onRemove={handleRemove}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 mb-4">Looking for more products?</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              Browse All Products
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Clear All Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="Clear your wishlist?"
        message="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
        confirmText="Clear Wishlist"
        cancelText="Keep Items"
        variant="danger"
        icon="heart"
      />

      {/* Add All to Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showAddAllConfirm}
        onClose={() => setShowAddAllConfirm(false)}
        onConfirm={handleMoveAllToCart}
        title="Add all items to cart?"
        message={`Add ${inStockCount} item${inStockCount > 1 ? 's' : ''} to your cart? Items will remain in your wishlist.`}
        confirmText="Add to Cart"
        cancelText="Cancel"
        variant="info"
        icon="cart"
      />
    </PageTransition>
  );
}
