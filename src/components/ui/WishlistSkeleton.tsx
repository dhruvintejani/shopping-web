import { memo } from 'react';
import { useReducedMotion } from '../../hooks/useDebounce';

// Memoized skeleton item component
const SkeletonItem = memo(function SkeletonItem() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 animate-pulse">
      <div className="flex flex-col sm:flex-row p-4 sm:p-5 gap-4 sm:gap-6">
        {/* Image placeholder */}
        <div className="flex-shrink-0 self-center sm:self-start">
          <div className="w-32 h-32 sm:w-36 sm:h-36 bg-gray-200 rounded-lg" />
        </div>

        {/* Content placeholder */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Brand */}
          <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
          
          {/* Title - 2 lines */}
          <div className="h-4 bg-gray-200 rounded w-full mb-1" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <div className="h-6 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-14" />
          </div>
          
          {/* Stock status */}
          <div className="h-3 bg-gray-200 rounded w-16 mb-4" />
          
          {/* Buttons - Desktop */}
          <div className="hidden sm:flex items-center gap-3 mt-auto">
            <div className="h-10 bg-gray-200 rounded-lg w-28" />
            <div className="h-10 bg-gray-200 rounded w-20" />
          </div>
        </div>

        {/* Price column - Desktop */}
        <div className="hidden lg:flex flex-col items-end pl-6 border-l border-gray-100 min-w-[140px]">
          <div className="h-8 bg-gray-200 rounded w-24 mb-1" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>

      {/* Mobile actions */}
      <div className="sm:hidden flex border-t border-gray-100">
        <div className="flex-1 py-3 flex items-center justify-center border-r border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="flex-1 py-3 flex items-center justify-center">
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
});

interface WishlistSkeletonProps {
  count?: number;
}

export const WishlistSkeleton = memo(function WishlistSkeleton({ 
  count = 3 
}: WishlistSkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded-lg w-36 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </div>

        {/* Summary card skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 animate-pulse">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-1" />
                <div className="h-6 bg-gray-200 rounded w-24" />
              </div>
              <div className="pl-6 border-l border-gray-200">
                <div className="h-3 bg-gray-200 rounded w-20 mb-1" />
                <div className="h-6 bg-gray-200 rounded w-20" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        </div>

        {/* Items skeleton */}
        <div 
          className="space-y-4"
          style={prefersReducedMotion ? {} : { animationPlayState: 'running' }}
        >
          {[...Array(count)].map((_, i) => (
            <SkeletonItem key={i} />
          ))}
        </div>
      </div>
    </div>
  );
});
