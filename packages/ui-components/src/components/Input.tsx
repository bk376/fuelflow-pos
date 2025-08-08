import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import type { InputProps } from '@gas-station/types';

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  error,
  label,
  icon,
  onChange,
  className,
  size = 'md',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useRef(`input-${Math.random().toString(36).substr(2, 9)}`);

  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (!isControlled && defaultValue !== undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const sizeClasses = {
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
  };

  const inputClasses = clsx(
    'input-base',
    sizeClasses[size as keyof typeof sizeClasses],
    {
      'input-error': error,
      'pr-12': error || icon,
      'pl-12': icon,
    },
    className
  );

  const containerClasses = clsx('relative', {
    'opacity-50': disabled,
  });

  return (
    <div className="space-y-1">
      {label && (
        <motion.label
          htmlFor={inputId.current}
          className="block text-sm font-medium text-secondary-900 dark:text-secondary-100"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className={containerClasses}>
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="text-secondary-400 dark:text-secondary-500">
              {icon}
            </span>
          </div>
        )}
        
        <motion.input
          ref={inputRef}
          id={inputId.current}
          type={type}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          {...props}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <ExclamationCircleIcon className="w-5 h-5 text-danger-500" />
          </div>
        )}
        
        {/* Focus Ring */}
        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-primary-500 pointer-events-none"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-sm text-danger-600 dark:text-danger-400 flex items-center gap-1"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;