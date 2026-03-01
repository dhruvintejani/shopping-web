import { memo } from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../hooks/useDebounce';

interface ProductSkeletonProps {
  variant?: 'card' | 'list' | 'detail';
  className?: string;
}

export const ProductSkeleton = memo(({
  variant = 'card',
  className,
}: ProductSkeletonProps) => {
  const reducedMotion = useReducedMotion();
  const animateClass = reducedMotion ? '' : 'animate-pulse';

  if (variant === 'list') {
    return (
      <div className={cn(
        'flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100',
        animateClass,
        className
      )}>
        {/* Image */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <div className="w-20 h-9 bg-gray-200 rounded-lg" />
          <div className="w-9 h-9 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={cn('grid md:grid-cols-2 gap-8', animateClass, className)}>
        {/* Image */}
        <div className="aspect-square bg-gray-200 rounded-xl" />
        
        {/* Content */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-5 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="flex gap-4 pt-4">
            <div className="h-12 bg-gray-200 rounded-lg flex-1" />
            <div className="h-12 bg-gray-200 rounded-lg w-12" />
          </div>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-100 overflow-hidden',
      animateClass,
      className
    )}>
      {/* Image */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-12" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  );
});

ProductSkeleton.displayName = 'ProductSkeleton';

// Grid of skeletons
interface ProductSkeletonGridProps {
  count?: number;
  variant?: 'card' | 'list';
  className?: string;
}

export const ProductSkeletonGrid = memo(({
  count = 8,
  variant = 'card',
  className,
}: ProductSkeletonGridProps) => {
  if (variant === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <ProductSkeleton key={i} variant="list" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} variant="card" />
      ))}
    </div>
  );
});

ProductSkeletonGrid.displayName = 'ProductSkeletonGrid';
