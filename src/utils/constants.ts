// Categories
export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Sports & Outdoors',
  'Beauty & Personal Care',
  'Toys & Games',
  'Health & Wellness',
] as const;

// Badge types
export const BADGE_TYPES = ['bestseller', 'deal', 'new'] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

// Price ranges
export const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200, max: undefined },
] as const;

// Rating options
export const RATING_OPTIONS = [4, 3, 2, 1] as const;

// Countries for location
export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SG', name: 'Singapore' },
  { code: 'NZ', name: 'New Zealand' },
] as const;

// Navigation items
export const NAV_ITEMS = [
  { label: 'All Products', path: '/products' },
  { label: "Today's Deals", path: '/products?badge=deal' },
  { label: 'New Arrivals', path: '/products?sort=newest' },
  { label: 'Best Sellers', path: '/products?badge=bestseller' },
  { label: 'Electronics', path: '/products?category=Electronics' },
  { label: 'Fashion', path: '/products?category=Fashion' },
  { label: 'Home & Kitchen', path: '/products?category=Home+%26+Kitchen' },
  { label: 'Books', path: '/products?category=Books' },
] as const;
