import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const cardClasses = clsx(
    'card-base',
    paddingClasses[padding],
    {
      'card-hover cursor-pointer': hover || onClick,
    },
    className
  );

  const CardComponent = onClick ? motion.button : motion.div;

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={hover || onClick ? { y: -4, scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {children}
    </CardComponent>
  );
};

export default Card;