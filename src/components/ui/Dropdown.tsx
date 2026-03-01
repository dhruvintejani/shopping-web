import { memo, useState, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { cn } from '../../utils/cn';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  showCheckmark?: boolean;
  disabled?: boolean;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

export const Dropdown = memo(({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  label,
  className,
  triggerClassName,
  menuClassName,
  size = 'md',
  showCheckmark = true,
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => setIsOpen(false), []);
  useOutsideClick(dropdownRef, handleClose, isOpen);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = useCallback((optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  }, [onChange]);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg',
          'hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
          'transition-colors duration-150 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeStyles[size],
          triggerClassName
        )}
      >
        <span className={cn(
          'truncate',
          selectedOption ? 'text-gray-900' : 'text-gray-500'
        )}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            'w-4 h-4 ml-2 text-gray-400 transition-transform duration-150',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden',
              menuClassName
            )}
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full flex items-center px-4 py-2.5 text-left transition-colors cursor-pointer',
                    option.value === value
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {option.icon && (
                    <span className="mr-3 flex-shrink-0">{option.icon}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="block font-medium truncate">{option.label}</span>
                    {option.description && (
                      <span className="block text-xs text-gray-500 truncate">
                        {option.description}
                      </span>
                    )}
                  </div>
                  {showCheckmark && option.value === value && (
                    <CheckIcon className="w-4 h-4 text-orange-600 ml-2 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Dropdown.displayName = 'Dropdown';
