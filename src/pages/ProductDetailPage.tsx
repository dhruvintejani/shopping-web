import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import { StarRating } from '../components/ui/StarRating';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { useReducedMotion } from '../hooks/useDebounce';
import { StaggerItem } from '../components/animations/PageTransition';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => product ? state.isInWishlist(product.id) : false);
  const addToast = useUIStore((state) => state.addToast);
  const prefersReducedMotion = useReducedMotion();

  const handleWishlistToggle = useCallback(() => {
    if (!product) return;
    toggleWishlist(product);
    addToast({
      type: isInWishlist ? 'info' : 'success',
      message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
    });
  }, [product, toggleWishlist, isInWishlist, addToast]);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setIsLoading(true);
      const [productData, related] = await Promise.all([
        productService.getProductById(id),
        productService.getRelatedProducts(id),
      ]);
      setProduct(productData);
      setRelatedProducts(related);
      setIsLoading(false);
      setSelectedImage(0);
      setQuantity(1);
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    if (!product || product.stock === 0) return;
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    addItem(product, quantity);
    setIsAdding(false);
    addToast({
      type: 'success',
      message: `Added ${quantity} item(s) to cart`,
    });
  }, [product, quantity, addItem, addToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8 animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div>
                <div className="h-8 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-6" />
                <div className="h-24 bg-gray-200 rounded mb-6" />
                <div className="h-12 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/products" className="text-orange-600 hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Premium Breadcrumb with fade-in animation */}
        <Breadcrumb
          className="mb-6"
          items={[
            { label: 'Products', href: '/products' },
            { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
            { label: product.title },
          ]}
        />

        {/* Main Product Section */}
        <div className="bg-white rounded-xl p-6 md:p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <motion.div
                key={selectedImage}
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4"
              >
                <img
                  src={product.images[selectedImage] || product.image}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </motion.div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === selectedImage ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.badge && (
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700 mb-3">
                  {product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
                </span>
              )}

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>

              <p className="text-sm text-gray-500 mb-3">
                Brand: <span className="text-orange-600">{product.brand}</span>
              </p>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} size="md" showValue />
                <span className="text-sm text-gray-500">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
              </div>

              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm font-semibold text-red-600">
                        Save {discountPercent}%
                      </span>
                    </>
                  )}
                </div>
                {product.price >= 35 && (
                  <p className="text-sm text-emerald-600 mt-2">
                    ✓ FREE delivery on this order
                  </p>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Stock */}
              {product.stock > 0 ? (
                <p className="text-emerald-600 font-medium mb-4">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium mb-4">Out of Stock</p>
              )}

              {/* Quantity & Add to Cart */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 min-w-[50px] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mb-6 ${
                  isInWishlist 
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
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
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>

              {/* Specifications */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="contents">
                      <dt className="text-gray-500">{key}</dt>
                      <dd className="text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              initial="hidden"
              animate="visible"
              variants={prefersReducedMotion ? {} : {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {relatedProducts.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
