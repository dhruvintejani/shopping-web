import { memo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useDebounce';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = memo(function PageTransition({ children }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.25,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
});

// Staggered list animation for product grids
interface StaggeredListProps {
  children: ReactNode[];
  className?: string;
}

export const StaggeredList = memo(function StaggeredList({ children, className }: StaggeredListProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div 
      className={className}
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
      {children}
    </motion.div>
  );
});

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = memo(function StaggerItem({ children, className }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: -8 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1]
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
});

// Dropdown animation wrapper
interface DropdownAnimationProps {
  children: ReactNode;
  isOpen: boolean;
}

export const DropdownAnimation = memo(function DropdownAnimation({ children, isOpen }: DropdownAnimationProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!isOpen) return null;

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
});
