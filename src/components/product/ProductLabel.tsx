import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../hooks/useDebounce';

export type LabelType = 'bestseller' | 'deal' | 'new' | 'discount';

interface ProductLabelProps {
  type: LabelType;
  value?: string | number; // For discount percentage
  className?: string;
  animate?: boolean;
  delay?: number;
}

const labelStyles: Record<LabelType, { bg: string; text: string; label: string }> = {
  bestseller: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    label: 'Best Seller',
  },
  deal: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    label: "Today's Deal",
  },
  new: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: 'New',
  },
  discount: {
    bg: 'bg-red-500',
    text: 'text-white',
    label: '% OFF',
  },
};

export const ProductLabel = memo(({
  type,
  value,
  className,
  animate = true,
  delay = 0,
}: ProductLabelProps) => {
  const reducedMotion = useReducedMotion();
  const style = labelStyles[type];

  const label = type === 'discount' && value
    ? `${value}% OFF`
    : style.label;

  const content = (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
        style.bg,
        style.text,
        className
      )}
    >
      {label}
    </span>
  );

  if (!animate || reducedMotion) {
    return content;
  }

  return (
    <motion.span
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
        delay,
      }}
      className="inline-block"
    >
      {content}
    </motion.span>
  );
});

ProductLabel.displayName = 'ProductLabel';

// Group of labels
interface ProductLabelsProps {
  badge?: string;
  discount?: number;
  className?: string;
}

export const ProductLabels = memo(({
  badge,
  discount,
  className,
}: ProductLabelsProps) => {
  const hasLabels = badge || (discount && discount > 0);

  if (!hasLabels) return null;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {badge === 'bestseller' && (
        <ProductLabel type="bestseller" delay={0} />
      )}
      {badge === 'deal' && (
        <ProductLabel type="deal" delay={0.05} />
      )}
      {badge === 'new' && (
        <ProductLabel type="new" delay={0.05} />
      )}
      {discount && discount > 0 && (
        <ProductLabel type="discount" value={discount} delay={0.1} />
      )}
    </div>
  );
});

ProductLabels.displayName = 'ProductLabels';
