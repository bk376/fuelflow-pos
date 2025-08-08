import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import type { ButtonProps } from '@gas-station/types';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  children,
  onClick,
  className,
  ...props
}) => {
  const baseClasses = 'btn-base touch-friendly';
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
  };
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  const buttonClasses = clsx(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    {
      'cursor-not-allowed opacity-50': disabled || loading,
    },
    className
  );

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </motion.button>
  );
};

export default Button;