import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { CategoryNav } from './CategoryNav';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useLocationStore } from '../../store/locationStore';
import { useDebounce, useReducedMotion } from '../../hooks/useDebounce';
import { productService } from '../../services/productService';
import { SearchSuggestion } from '../../types';
import { categories } from '../../data/products';

/* ==========================================
   Z-INDEX SCALE (DOCUMENTED)
   ==========================================
   z-0   : Base page content
   z-10  : Header base
   z-20  : Header buttons & icons
   z-30  : Category dropdown (before search)
   z-40  : Search suggestions dropdown & Account dropdown
   z-50  : Side drawers / panels
   z-60  : Modals / confirmation dialogs
   z-70  : Toast notifications
   ========================================== */

export const Header = memo(function Header() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [searchParams] = useSearchParams();
  const isWishlistPage = routeLocation.pathname === '/wishlist';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  // Track loading state for suggestions (used internally)
  const isLoadingSuggestionsRef = useRef(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>('');

  const debouncedQuery = useDebounce(searchQuery, 250);
  const prefersReducedMotion = useReducedMotion();

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { user, isAuthenticated, logout } = useAuthStore();
  const openCart = useUIStore((state) => state.openCart);
  const { location, openModal: openLocationModal } = useLocationStore();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [searchParams]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Scroll detection for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch suggestions with cancellation - FIXED to prevent flicker & double render
  useEffect(() => {
    const query = debouncedQuery.trim();
    
    // Skip if query hasn't changed
    if (query === lastQueryRef.current) return;
    lastQueryRef.current = query;
    
    if (query.length >= 2) {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      isLoadingSuggestionsRef.current = true;

      productService.getSearchSuggestions(query)
        .then((results) => {
          // Only update if this is still the current query
          if (lastQueryRef.current === query) {
            setSuggestions(results.slice(0, 5));
            setShowSuggestions(true);
          }
        })
        .catch(() => {
          // Ignore abort errors
        })
        .finally(() => {
          isLoadingSuggestionsRef.current = false;
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node) &&
        !mobileSearchInputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      // Close category dropdown when clicking outside
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close category dropdown on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCategoryDropdown(false);
      }
    };
    if (showCategoryDropdown) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showCategoryDropdown]);

  // Handle category selection from header dropdown
 const handleCategorySelect = useCallback(
  (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);

    const params = new URLSearchParams();

    // If user has typed search, keep it
    const q = searchQuery.trim();
    if (q) params.set('q', q);

    // If category isn't "All", add it
    if (category !== 'All') params.set('category', category);

    // ✅ Always navigate
    const qs = params.toString();
    navigate(qs ? `/products?${qs}` : '/products');
  },
  [searchQuery, navigate]
);

  const handleSearch = useCallback(
    (query: string = searchQuery) => {
      if (query.trim()) {
        const params = new URLSearchParams();
        params.set('q', query.trim());
        if (selectedCategory !== 'All') {
          params.set('category', selectedCategory);
        }
        navigate(`/products?${params.toString()}`);
        setShowSuggestions(false);
        setIsMobileSearchOpen(false);
        searchInputRef.current?.blur();
        mobileSearchInputRef.current?.blur();
      }
    },
    [searchQuery, selectedCategory, navigate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          navigate(`/product/${suggestions[selectedIndex].id}`);
          setShowSuggestions(false);
          setIsMobileSearchOpen(false);
        } else {
          handleSearch();
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        searchInputRef.current?.blur();
        mobileSearchInputRef.current?.blur();
      }
    },
    [suggestions, selectedIndex, navigate, handleSearch]
  );

  const handleLogout = useCallback(() => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const mobileMenuVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { x: '-100%' },
    visible: prefersReducedMotion ? { opacity: 1 } : { x: 0 },
    exit: prefersReducedMotion ? { opacity: 0 } : { x: '-100%' },
  };

  // Search suggestions dropdown component - stable render, prevents flickering
  const renderSearchSuggestions = (isMobile = false) => (
    <AnimatePresence mode="wait">
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          ref={!isMobile ? suggestionsRef : undefined}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden ${
            isMobile ? 'mx-0' : ''
          }`}
          role="listbox"
          style={{ zIndex: 40 }}
        >
          {suggestions.map((suggestion, index) => (
            <Link
              key={suggestion.id}
              to={`/product/${suggestion.id}`}
              onClick={() => {
                setShowSuggestions(false);
                setIsMobileSearchOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-orange-50' : ''
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <img
                src={suggestion.image}
                alt=""
                className="w-10 h-10 object-contain rounded"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{suggestion.title}</p>
                <p className="text-xs text-gray-500">in {suggestion.category}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
          <button
            onClick={() => handleSearch()}
            className="w-full px-4 py-3 text-left text-sm text-orange-600 hover:bg-orange-50 border-t border-gray-100 font-medium"
          >
            See all results for "{searchQuery}"
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-100 bg-slate-900 transition-shadow duration-200 ${
        isScrolled ? 'shadow-lg shadow-black/20' : ''
      }`}
    >
      {/* Main Header */}
      <div className="flex items-center px-3 md:px-4 py-3 gap-2 md:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo - Slightly larger & balanced */}
        <Link to="/" className="flex-shrink-0">
          <Logo className="w-28 h-8 md:w-36 md:h-10" variant="light" />
        </Link>

        {/* Delivery Location - Desktop only */}
        <button
          onClick={openLocationModal}
          className="hidden lg:flex items-center gap-1 text-white cursor-pointer p-2 transition-all group relative"
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="text-xs text-left">
            <p className="text-gray-400">Deliver to</p>
            <p className="font-bold text-sm">
              {location.city || location.country}
            </p>
          </div>
          {/* Animated underline */}
          <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 ease-out" />
        </button>

        {/* Search Bar - Desktop */}
        <div
          className={`hidden md:flex flex-1 relative z-[40] transition-all duration-200 ${
            isSearchFocused ? 'scale-[1.01]' : ''
          }`}
        >
          {/* Category Dropdown - Redesigned */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-2.5 rounded-l-lg border-r border-gray-300 focus:outline-none cursor-pointer hover:bg-gray-200 transition-colors h-full"
            >
              <span className="max-w-[80px] truncate">{selectedCategory}</span>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${showCategoryDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Category Dropdown Menu */}
            <AnimatePresence>
              {showCategoryDropdown && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg border border-gray-200 shadow-lg z-30 overflow-hidden"
                >
                  <div className="py-1 max-h-[300px] overflow-y-auto">
                    <button
                     type="button"
                      onClick={() => handleCategorySelect('All')}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                        selectedCategory === 'All'
                          ? 'bg-orange-50 text-orange-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>All Categories</span>
                      {selectedCategory === 'All' && (
                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                          selectedCategory === cat.name
                            ? 'bg-orange-50 text-orange-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {selectedCategory === cat.name && (
                          <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex-1 relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              onFocus={() => {
                setIsSearchFocused(true);
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Search Shoply"
              className="w-full px-4 py-2.5 text-gray-900 focus:outline-none bg-white"
              aria-label="Search products"
              autoComplete="off"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                  searchInputRef.current?.focus();
                }}
                className="absolute right-2 rounded-lg top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={() => handleSearch()}
            className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-r-lg transition-colors"
            aria-label="Search"
          >
            <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Desktop Search Suggestions */}
          {renderSearchSuggestions()}
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors ml-auto"
          aria-label="Search"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Wishlist - Desktop only */}
        <Link
          to="/wishlist"
          className={`hidden md:flex items-center p-2 relative group ${
            isWishlistPage ? 'text-orange-400' : 'text-white'
          }`}
          aria-label={`Wishlist with ${wishlistCount} items`}
        >
          <svg 
            className="w-7 h-7" 
            fill={isWishlistPage ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {wishlistCount}
            </span>
          )}
          {/* Animated underline - only show on non-active page */}
          {!isWishlistPage && (
            <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-orange-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 ease-out" />
          )}
        </Link>

        {/* Account Menu - Desktop */}
        <div
          className="relative hidden md:block"
          onMouseEnter={() => setShowAccountMenu(true)}
          onMouseLeave={() => setShowAccountMenu(false)}
        >
          {isAuthenticated ? (
            <button className="flex flex-col text-white p-2 transition-all relative group">
              <span className="text-xs text-gray-300">
                Hello, {user?.name?.split(' ')[0]}
              </span>
              <span className="text-sm font-bold flex items-center">
                Account & Lists
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              {/* Animated underline */}
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 ease-out" />
            </button>
          ) : (
            <Link
              to="/login"
              className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Sign In</span>
            </Link>
          )}

          {/* Premium Dropdown - Enterprise-Level Design */}
          <AnimatePresence>
            {showAccountMenu && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-30"
                role="menu"
                aria-orientation="vertical"
              >
                {isAuthenticated ? (
                  <>
                    {/* Top Section: User Context */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm flex-shrink-0">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-base truncate">{user?.name}</p>
                          <p className="text-sm text-gray-500 truncate mt-0.5">{user?.email}</p>
                        </div>
                      </div>
                      {user?.role === 'admin' && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md font-medium border border-purple-100">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Admin Account
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Middle Section: Primary Links */}
                    <div className="py-2">
                      <p className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Account</p>
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                      >
                        <span className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">Your Profile</span>
                          <p className="text-xs text-gray-500 mt-0.5">Manage your account details</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                      >
                        <span className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">Your Orders</span>
                          <p className="text-xs text-gray-500 mt-0.5">Track, return, or buy again</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                      >
                        <span className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">Wishlist</span>
                          <p className="text-xs text-gray-500 mt-0.5">Your saved items</p>
                        </div>
                        {wishlistCount > 0 && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">
                            {wishlistCount}
                          </span>
                        )}
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link 
                        to="/cart" 
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                      >
                        <span className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">Your Cart</span>
                          <p className="text-xs text-gray-500 mt-0.5">View cart items</p>
                        </div>
                        {cartItemCount > 0 && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">
                            {cartItemCount}
                          </span>
                        )}
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      
                      {/* Admin Link - Highlighted Section */}
                      {user?.role === 'admin' && (
                        <>
                          <div className="my-2 mx-5 border-t border-gray-100" />
                          <Link 
                            to="/admin" 
                            className="flex items-center gap-3 px-5 py-3 hover:bg-purple-50 transition-colors group mx-2 rounded-lg"
                            role="menuitem"
                          >
                            <span className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </span>
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-purple-700">Admin Dashboard</span>
                              <p className="text-xs text-purple-500 mt-0.5">Manage products & orders</p>
                            </div>
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </>
                      )}
                    </div>
                    
                    {/* Bottom Section: Sign Out */}
                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors font-medium"
                        role="menuitem"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Top Section: Sign In CTA */}
                    <div className="px-5 py-5 border-b border-gray-100">
                      <Link
                        to="/login"
                        className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-center py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                        role="menuitem"
                      >
                        Sign In
                      </Link>
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        New customer?{' '}
                        <Link to="/register" className="text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                          Start here
                        </Link>
                      </p>
                    </div>
                    
                    {/* Middle Section: Quick Links */}
                    <div className="py-2">
                      <p className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Links</p>
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                      >
                        <span className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">Track Orders</span>
                          <p className="text-xs text-gray-500 mt-0.5">Check your order status</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                      >
                        <span className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">Wishlist</span>
                          <p className="text-xs text-gray-500 mt-0.5">Save items for later</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link 
                        to="/help" 
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                      >
                        <span className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">Help Center</span>
                          <p className="text-xs text-gray-500 mt-0.5">Get support & FAQs</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Orders - Desktop only */}
        <Link
          to="/orders"
          className="hidden lg:flex flex-col text-white p-2 relative group"
        >
          <span className="text-xs text-gray-300">Returns</span>
          <span className="text-sm font-bold">& Orders</span>
          {/* Animated underline */}
          <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 ease-out" />
        </Link>

        {/* Cart */}
        <button
          onClick={openCart}
          className="flex items-center text-white p-2 relative group"
          aria-label={`Cart with ${cartItemCount} items`}
        >
          <div className="relative">
            <svg className="w-8 h-8 md:w-9 md:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <motion.span
              key={cartItemCount}
              initial={prefersReducedMotion ? false : { scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
            >
              {cartItemCount}
            </motion.span>
          </div>
          <span className="hidden sm:block font-bold ml-1">Cart</span>
        </button>
      </div>

      {/* Category Navigation - Desktop */}
<div className="relative z-[10]">
        <CategoryNav />
      </div>
      {/* Mobile Menu Overlay - z-50 (drawer level) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-[300px] max-w-[85vw] bg-white z-50 overflow-y-auto md:hidden"
            >
              {/* Mobile Menu Header */}
              <div className="bg-slate-800 text-white p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {isAuthenticated ? `Hello, ${user?.name}` : 'Hello, Sign in'}
                    </p>
                    {!isAuthenticated && (
                      <Link 
                        to="/login" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-orange-400 hover:underline"
                      >
                        Sign in or Create account
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Content */}
              <nav className="p-4">
                {/* Main Navigation */}
                <div className="space-y-1 mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shop</p>
                  <Link 
                    to="/products" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-gray-900 hover:text-orange-600"
                  >
                    <span>All Products</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link 
                    to="/products?badge=deal" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-gray-900 hover:text-orange-600"
                  >
                    <span>Today's Deals</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link 
                    to="/products?badge=bestseller" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-gray-900 hover:text-orange-600"
                  >
                    <span>Best Sellers</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Categories */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</p>
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 text-gray-700 hover:text-orange-600"
                    >
                      <span>{cat.name}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>

                {/* Account */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Account</p>
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2.5 text-gray-700 hover:text-orange-600"
                      >
                        <span>Your Profile</span>
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2.5 text-gray-700 hover:text-orange-600"
                      >
                        <span>Your Orders</span>
                      </Link>
                      <Link 
                        to="/wishlist" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2.5 text-gray-700 hover:text-orange-600"
                      >
                        <span>Wishlist</span>
                        {wishlistCount > 0 && (
                          <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-2.5 text-gray-700 hover:text-orange-600"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2.5 text-gray-700 hover:text-orange-600"
                      >
                        <span>Sign In</span>
                      </Link>
                      <Link 
                        to="/register" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2.5 text-gray-700 hover:text-orange-600"
                      >
                        <span>Create Account</span>
                      </Link>
                    </>
                  )}
                </div>

                {/* Location */}
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openLocationModal();
                    }}
                    className="flex items-center gap-3 py-2.5 text-gray-700 hover:text-orange-600 w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Deliver to {location.city || location.country}</span>
                  </button>
                </div>
              </nav>

              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay - z-50 (drawer level) */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-white z-50 md:hidden"
          >
            <div className="flex items-center gap-2 p-3 bg-slate-900">
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 text-white hover:bg-white/10 rounded-lg"
                aria-label="Close search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="flex-1 relative">
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search Shoply"
                  className="w-full px-4 py-2.5 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                      mobileSearchInputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={() => handleSearch()}
                className="p-2 bg-orange-500 text-white rounded-lg"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Search Suggestions */}
            <div className="p-3 relative">
              {renderSearchSuggestions(true)}
              
              {/* Recent searches or popular categories */}
              {!showSuggestions && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setIsMobileSearchOpen(false)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});
