import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../components/product/ProductCard';
import { PremiumDropdown } from '../components/ui/PremiumDropdown';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { productService } from '../services/productService';
import { categories, brands } from '../data/products';
import { Product, ProductFilters } from '../types';
import { useReducedMotion } from '../hooks/useDebounce';
import { useUIStore } from '../store/uiStore';
import { StaggerItem } from '../components/animations/PageTransition';

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const addToast = useUIStore((state) => state.addToast);
  
  // Ref for brand filter scroll preservation
  const brandListRef = useRef<HTMLDivElement>(null);
  const brandScrollPosition = useRef<number>(0);

  // Parse filters from URL
  const filters: ProductFilters = useMemo(() => ({
    search: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    sort: (searchParams.get('sort') as ProductFilters['sort']) || 'popular',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  }), [searchParams]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const response = await productService.getProducts(filters);
        setProducts(response.products);
        setTotalProducts(response.total);
      } catch {
        addToast({ type: 'error', message: 'Failed to load products' });
      }
      setIsLoading(false);
    }
    fetchProducts();
  }, [filters, addToast]);

  const updateFilter = useCallback((key: string, value: string | number | boolean | null) => {
    const params = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    params.delete('page'); // Reset to first page on filter change
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.inStock) count++;
    return count;
  }, [filters]);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter('category', null)}
            className={`text-sm w-full text-left px-3 py-2 rounded-lg border-2 transition-all duration-150 ${
              !filters.category
                ? 'bg-orange-50 border-orange-500 text-orange-700 font-medium shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => updateFilter('category', isSelected ? null : cat.name)}
                className={`text-sm w-full text-left px-3 py-2 rounded-lg border-2 transition-all duration-150 ${
                  isSelected
                    ? 'bg-orange-50 border-orange-500 text-orange-700 font-medium shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
        <div className="space-y-1.5">
          {[
            { label: 'Under $25', min: 0, max: 25 },
            { label: '$25 - $50', min: 25, max: 50 },
            { label: '$50 - $100', min: 50, max: 100 },
            { label: '$100 - $200', min: 100, max: 200 },
            { label: 'Over $200', min: 200, max: null },
          ].map((range) => {
            // Fixed price selection logic
            const isSelected = 
              filters.minPrice === range.min && 
              ((range.max === null && filters.maxPrice === undefined) || filters.maxPrice === range.max);
            return (
              <button
                key={range.label}
                onClick={() => {
                  if (isSelected) {
                    // Clear both price filters
                    const params = new URLSearchParams(searchParams);
                    params.delete('minPrice');
                    params.delete('maxPrice');
                    params.delete('page');
                    setSearchParams(params);
                  } else {
                    // Set both price filters
                    const params = new URLSearchParams(searchParams);
                    params.set('minPrice', String(range.min));
                    if (range.max !== null) {
                      params.set('maxPrice', String(range.max));
                    } else {
                      params.delete('maxPrice');
                    }
                    params.delete('page');
                    setSearchParams(params);
                  }
                }}
                className={`text-sm w-full text-left px-3 py-2 rounded-lg border-2 transition-all duration-150 ${
                  isSelected 
                    ? 'bg-orange-50 border-orange-500 text-orange-700 font-medium shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand - with scroll position preservation */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
        <div 
          ref={brandListRef}
          className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin"
          onScroll={(e) => {
            brandScrollPosition.current = e.currentTarget.scrollTop;
          }}
        >
          {brands.map((brand) => {
            const isSelected = filters.brand === brand;
            return (
              <button
                key={brand}
                onClick={() => {
                  // Save scroll position before update
                  const scrollPos = brandScrollPosition.current;
                  updateFilter('brand', isSelected ? null : brand);
                  // Restore scroll position after React updates
                  requestAnimationFrame(() => {
                    if (brandListRef.current) {
                      brandListRef.current.scrollTop = scrollPos;
                    }
                  });
                }}
                className={`text-sm w-full text-left px-3 py-2 rounded-lg border-2 transition-all duration-150 truncate ${
                  isSelected 
                    ? 'bg-orange-50 border-orange-500 text-orange-700 font-medium shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Customer Rating</h3>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((rating) => {
            const isSelected = filters.minRating === rating;
            return (
              <button
                key={rating}
                onClick={() => updateFilter('minRating', isSelected ? null : rating)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg border-2 transition-all duration-150 ${
                  isSelected
                    ? 'bg-orange-50 border-orange-500 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className={`text-sm ${isSelected ? 'text-orange-700 font-medium' : 'text-gray-600'}`}>& Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <button
          onClick={() => updateFilter('inStock', !filters.inStock)}
          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-150 ${
            filters.inStock
              ? 'bg-orange-50 border-orange-500 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span className={`text-sm ${filters.inStock ? 'text-orange-700 font-medium' : 'text-gray-700'}`}>
            In Stock Only
          </span>
          {filters.inStock && (
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 w-full flex-1 flex flex-col">
        {/* Static Header Section - Does NOT scroll */}
        <div className="sticky top-0 bg-gray-100 pt-6 pb-4 z-10">
          {/* Premium Breadcrumb */}
          <Breadcrumb
            className="mb-4"
            items={[
              { label: 'Products', href: filters.category ? '/products' : undefined },
              ...(filters.category ? [{ label: filters.category }] : []),
            ]}
          />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {filters.search ? `Results for "${filters.search}"` : filters.category || 'All Products'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort - Premium Dropdown */}
              <PremiumDropdown
                options={sortOptions}
                value={filters.sort || 'popular'}
                onChange={(value) => updateFilter('sort', value)}
                className="w-48"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8 flex-1 pb-6">
          {/* Desktop Sidebar - Independent Scrollbar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin">
              <FilterSidebar />
            </div>
          </aside>

          {/* Products Grid - Independent Scrollbar */}
          <main className="flex-1 min-h-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.04,
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
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
              animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto lg:hidden"
            >
              <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar />
              </div>
              <div className="sticky bottom-0 bg-white px-4 py-4 border-t border-gray-200">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Show {totalProducts} results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
