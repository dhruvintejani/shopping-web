import { memo } from 'react';
import { cn } from '../../utils/cn';

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoaderVariant = 'spinner' | 'dots' | 'pulse';

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const sizeStyles: Record<LoaderSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const SpinnerLoader = memo(({ size, className }: { size: LoaderSize; className?: string }) => (
  <div className={cn(
    'animate-spin rounded-full border-2 border-gray-200 border-t-orange-500',
    sizeStyles[size],
    className
  )} />
));
SpinnerLoader.displayName = 'SpinnerLoader';

const DotsLoader = memo(({ size, className }: { size: LoaderSize; className?: string }) => {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3';
  return (
    <div className={cn('flex space-x-1.5', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-orange-500 rounded-full animate-bounce',
            dotSize
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
});
DotsLoader.displayName = 'DotsLoader';

const PulseLoader = memo(({ size, className }: { size: LoaderSize; className?: string }) => (
  <div className={cn(
    'bg-orange-500 rounded-full animate-pulse',
    sizeStyles[size],
    className
  )} />
));
PulseLoader.displayName = 'PulseLoader';

export const Loader = memo(({
  size = 'md',
  variant = 'spinner',
  className,
  text,
  fullScreen = false,
}: LoaderProps) => {
  const LoaderComponent = {
    spinner: SpinnerLoader,
    dots: DotsLoader,
    pulse: PulseLoader,
  }[variant];

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <LoaderComponent size={size} />
      {text && (
        <p className="text-sm text-gray-500 font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
});

Loader.displayName = 'Loader';

// Page loader wrapper
export const PageLoader = memo(({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader size="lg" text={text} />
  </div>
));
PageLoader.displayName = 'PageLoader';
