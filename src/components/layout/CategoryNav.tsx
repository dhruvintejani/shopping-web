import { memo, useCallback } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

// Types for navigation items
interface NavItemConfig {
  label: string;
  href: string;
  matchPath?: string;
  matchExact?: boolean;
  matchParam?: { key: string; value: string };
}

// Navigation items - static list as specified
const NAV_ITEMS: NavItemConfig[] = [
  { label: 'All Products', href: '/products', matchPath: '/products', matchExact: true },
  { label: "Today's Deals", href: '/products?badge=deal', matchParam: { key: 'badge', value: 'deal' } },
  { label: 'New Arrivals', href: '/products?sort=newest', matchParam: { key: 'sort', value: 'newest' } },
  { label: 'Best Sellers', href: '/products?badge=bestseller', matchParam: { key: 'badge', value: 'bestseller' } },
  { label: 'Electronics', href: '/products?category=Electronics', matchParam: { key: 'category', value: 'Electronics' } },
  { label: 'Fashion', href: '/products?category=Fashion', matchParam: { key: 'category', value: 'Fashion' } },
  { label: 'Home & Kitchen', href: '/products?category=Home+%26+Kitchen', matchParam: { key: 'category', value: 'Home & Kitchen' } },
  { label: 'Books', href: '/products?category=Books', matchParam: { key: 'category', value: 'Books' } },
];

interface NavItemProps {
  label: string;
  href: string;
  isActive: boolean;
}

// Memoized NavItem component - no inline handlers
const NavItem = memo(function NavItem({ label, href, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className="group relative py-2 px-1 whitespace-nowrap"
    >
      {/* Text label */}
      <span
        className={`text-sm font-medium transition-colors duration-150 ${
          isActive 
            ? 'text-gray-900' 
            : 'text-gray-700 group-hover:text-gray-900'
        }`}
      >
        {label}
      </span>
      
      {/* Underline - positioned with visible gap from text */}
      <span
        className={`absolute left-0 right-0 bottom-0 h-[2px] bg-orange-500 transition-transform duration-200 ease-out ${
          isActive
            ? 'scale-x-100 origin-left'
            : 'scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left'
        }`}
        aria-hidden="true"
      />
    </Link>
  );
});

// Main CategoryNav component - memoized
export const CategoryNav = memo(function CategoryNav() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check if nav item is active based on current route and params
  const isItemActive = useCallback((item: NavItemConfig): boolean => {
    // Must be on products page
    if (!location.pathname.startsWith('/products')) return false;

    // Check for exact path match (All Products)
    if (item.matchExact && item.matchPath) {
      // Active only if no significant query params
      const hasCategory = searchParams.has('category');
      const hasBadge = searchParams.has('badge');
      const hasSort = searchParams.get('sort') === 'newest';
      return !hasCategory && !hasBadge && !hasSort;
    }

    // Check for query param match
    if (item.matchParam) {
      const paramValue = searchParams.get(item.matchParam.key);
      return paramValue === item.matchParam.value;
    }

    return false;
  }, [location.pathname, searchParams]);

  return (
    <nav 
      className="bg-white border-b border-gray-200"
      aria-label="Category navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontal scroll container for mobile */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              href={item.href}
              isActive={isItemActive(item)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
});
