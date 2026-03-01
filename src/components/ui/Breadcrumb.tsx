import { memo, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  animate?: boolean;
}

export const Breadcrumb = memo(({
  items,
  showHome = true,
  className,
  animate = true,
}: BreadcrumbProps) => {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  const content = (
    <ol className="flex items-center flex-wrap gap-1">
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const isHome = index === 0 && showHome;

        return (
          <Fragment key={index}>
            <li className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center text-sm transition-colors cursor-pointer',
                    'text-gray-500 hover:text-orange-600'
                  )}
                >
                  {isHome && <HomeIcon className="w-4 h-4 mr-1" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'text-sm font-medium truncate max-w-[200px]',
                    isLast ? 'text-gray-900' : 'text-gray-500'
                  )}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
            {!isLast && (
              <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" />
            )}
          </Fragment>
        );
      })}
    </ol>
  );

  if (animate) {
    return (
      <motion.nav
        aria-label="Breadcrumb"
        className={cn('flex items-center', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      {content}
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
