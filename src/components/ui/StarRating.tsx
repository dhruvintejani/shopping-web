import { memo } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';
import { formatNumber } from '../../utils/format';

interface StarRatingProps {
  rating: number;
  reviews?: number;
  showCount?: boolean;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export const StarRating = memo(({
  rating,
  reviews,
  showCount = true,
  showValue = false,
  size = 'md',
  className,
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon key={`full-${i}`} className={cn(sizeStyles[size], 'text-amber-400')} />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <StarOutlineIcon className={cn(sizeStyles[size], 'text-amber-400')} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className={cn(sizeStyles[size], 'text-amber-400')} />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarOutlineIcon key={`empty-${i}`} className={cn(sizeStyles[size], 'text-gray-300')} />
        ))}
      </div>
      
      {showValue && (
        <span className={cn(
          'font-medium text-gray-700',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {showCount && reviews !== undefined && (
        <span className={cn(
          'text-gray-500',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          ({formatNumber(reviews)})
        </span>
      )}
    </div>
  );
});

StarRating.displayName = 'StarRating';
