import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/product/ProductCard';
import { categories } from '../data/products';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useReducedMotion } from '../hooks/useDebounce';
import { StaggerItem } from '../components/animations/PageTransition';
import { useAuthStore } from '../store/authStore';

const HeroBanner = memo(function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const slides = [
    {
      title: 'Summer Sale',
      subtitle: 'Up to 50% off on selected items',
      cta: 'Shop Now',
      link: '/products?badge=deal',
      bg: 'from-orange-500 to-red-600',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    },
    {
      title: 'New Arrivals',
      subtitle: 'Check out our latest collection',
      cta: 'Explore',
      link: '/products?sort=newest',
      bg: 'from-blue-600 to-purple-700',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    },
    {
      title: 'Best Sellers',
      subtitle: 'Shop our most popular products',
      cta: 'View All',
      link: '/products?badge=bestseller',
      bg: 'from-emerald-500 to-teal-600',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative h-[280px] md:h-[380px] overflow-hidden group">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          initial={false}
          animate={{
            opacity: index === currentSlide ? 1 : 0,
            scale: index === currentSlide ? 1 : 1.05,
          }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`}
          style={{ zIndex: index === currentSlide ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
            <div className="text-white max-w-lg">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index === currentSlide ? 1 : 0, y: 0 }}
                transition={{ delay: 0.2, duration: prefersReducedMotion ? 0 : 0.3 }}
                className="text-3xl md:text-5xl font-bold mb-4"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index === currentSlide ? 1 : 0, y: 0 }}
                transition={{ delay: 0.3, duration: prefersReducedMotion ? 0 : 0.3 }}
                className="text-base md:text-xl mb-6 text-white/90"
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index === currentSlide ? 1 : 0, y: 0 }}
                transition={{ delay: 0.4, duration: prefersReducedMotion ? 0 : 0.3 }}
              >
                <Link
                  to={slide.link}
                  className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {slide.cta}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

const CategoryGrid = memo(function CategoryGrid() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 pt-[70px] mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.productCount} products</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
});

const ProductSection = memo(function ProductSection({
  title,
  products,
  link,
  linkText,
}: {
  title: string;
  products: Product[];
  link: string;
  linkText: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          to={link}
          className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
        >
          {linkText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
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
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </motion.div>
    </section>
  );
});

export default function HomePage() {
  const [deals, setDeals] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [dealsData, bestsellersData] = await Promise.all([
        productService.getDeals(),
        productService.getBestsellers(),
      ]);
      setDeals(dealsData);
      setBestsellers(bestsellersData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        {/* Sign In Banner - Only show when not authenticated */}
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Sign in for personalized recommendations
                  </h2>
                  <p className="text-sm text-gray-500">
                    Get exclusive deals and track your orders
                  </p>
                </div>
              </div>
              <Link
                to="/login"
                className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign in securely
                </span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Categories */}
        <CategoryGrid />

        {/* Deals Section */}
        {!isLoading && deals.length > 0 && (
          <ProductSection
            title="Today's Deals"
            products={deals}
            link="/products?badge=deal"
            linkText="See all deals"
          />
        )}

        {/* Best Sellers */}
        {!isLoading && bestsellers.length > 0 && (
          <ProductSection
            title="Best Sellers"
            products={bestsellers}
            link="/products?badge=bestseller"
            linkText="View all"
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-500">On orders over $35</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure checkout</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-500">30-day return policy</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
