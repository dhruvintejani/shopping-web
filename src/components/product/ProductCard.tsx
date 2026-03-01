import { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { StarRating } from '../ui/StarRating';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUIStore } from '../../store/uiStore';
import { useReducedMotion } from '../../hooks/useDebounce';

interface ProductCardProps {
  product: Product;
}

// Memoized Badge component with animation
const AnimatedBadge = memo(function AnimatedBadge({ 
  badge, 
  prefersReducedMotion,
  delay = 0
}: { 
  badge: string; 
  prefersReducedMotion: boolean;
  delay?: number;
}) {
  const badgeStyles: Record<string, string> = {
    bestseller: 'bg-orange-500 text-white',
    deal: 'bg-red-600 text-white',
    new: 'bg-emerald-500 text-white',
    limited: 'bg-purple-600 text-white',
  };

  const badgeLabels: Record<string, string> = {
    bestseller: 'Best Seller',
    deal: 'Deal',
    new: 'New',
    limited: 'Limited',
  };

  return (
    <motion.span
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.2, 
        delay: delay,
        ease: 'easeOut'
      }}
      className={`text-xs font-semibold px-2 py-1 rounded ${badgeStyles[badge] || 'bg-gray-500 text-white'}`}
    >
      {badgeLabels[badge] || badge}
    </motion.span>
  );
});

// Memoized Discount Badge with animation
const AnimatedDiscountBadge = memo(function AnimatedDiscountBadge({ 
  discountPercent, 
  prefersReducedMotion,
  delay = 0
}: { 
  discountPercent: number; 
  prefersReducedMotion: boolean;
  delay?: number;
}) {
  return (
    <motion.span
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.2, 
        delay: delay,
        ease: 'easeOut'
      }}
      className="text-xs font-semibold px-2 py-1 rounded bg-red-600 text-white"
    >
      {discountPercent}% OFF
    </motion.span>
  );
});

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const addToast = useUIStore((state) => state.addToast);
  const prefersReducedMotion = useReducedMotion();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (product.stock === 0) return;

      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      addItem(product);
      setIsLoading(false);
      addToast({
        type: 'success',
        message: `${product.title.slice(0, 30)}... added to cart`,
      });
    },
    [product, addItem, addToast]
  );

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(product);
      addToast({
        type: isInWishlist ? 'info' : 'success',
        message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      });
    },
    [product, toggleWishlist, isInWishlist, addToast]
  );

  const formatReviews = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={
        prefersReducedMotion
          ? {}
          : {
              y: isHovered ? -4 : 0,
            }
      }
      transition={{ duration: 0.15 }}
      className="group"
    >
      <Link
        to={`/product/${product.id}`}
        className={`block bg-white rounded-xl overflow-hidden h-full transition-shadow duration-200 ${
          isHovered ? 'shadow-xl' : 'shadow-sm'
        }`}
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 p-4">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain"
          />

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlistToggle}
            whileTap={prefersReducedMotion ? {} : { scale: 0.85 }}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isInWishlist 
                ? 'bg-red-50 text-red-500' 
                : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
            } shadow-sm`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg 
              className="w-5 h-5" 
              fill={isInWishlist ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </motion.button>

          {/* Badges with LEFT → RIGHT animation */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badge && (
              <AnimatedBadge 
                badge={product.badge} 
                prefersReducedMotion={prefersReducedMotion}
                delay={0.05}
              />
            )}
            {discountPercent > 0 && (
              <AnimatedDiscountBadge 
                discountPercent={discountPercent} 
                prefersReducedMotion={prefersReducedMotion}
                delay={product.badge ? 0.1 : 0.05}
              />
            )}
          </div>

          {/* Stock Indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute bottom-2 left-2 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
              Only {product.stock} left!
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
          </p>

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[40px] group-hover:text-orange-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-xs text-gray-500">({formatReviews(product.reviews)})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock === 0 ? (
            <p className="text-sm font-medium text-red-600 mb-3">Out of Stock</p>
          ) : (
            <p className="text-xs text-emerald-600 mb-3">
              ✓ In Stock - Free delivery on orders $35+
            </p>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock === 0}
            className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white active:bg-orange-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding...
              </span>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </Link>
    </motion.div>
  );
});
