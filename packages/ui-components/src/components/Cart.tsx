import React from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { CartItem } from '@gas-station/types';
import Card from './Card';
import Button from './Button';

interface CartProps {
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onClearCart?: () => void;
  onCheckout?: () => void;
  className?: string;
}

const Cart: React.FC<CartProps> = ({
  items,
  subtotal,
  taxAmount,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  className,
}) => {
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem?.(itemId);
    } else {
      onUpdateQuantity?.(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    onRemoveItem?.(itemId);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Card className={clsx('h-full flex flex-col', className)} padding="none">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCartIcon className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              Cart
            </h2>
            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-sm font-medium">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCart}
              className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:text-danger-400 dark:hover:text-danger-300 dark:hover:bg-danger-900/20"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <ShoppingCartIcon className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                Your cart is empty
              </h3>
              <p className="text-secondary-500 dark:text-secondary-400">
                Add items to get started
              </p>
            </motion.div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{
                    layout: { duration: 0.3 },
                    opacity: { duration: 0.2 },
                    x: { duration: 0.2 },
                  }}
                  className="bg-secondary-50 dark:bg-secondary-800/50 rounded-xl p-4 space-y-3"
                >
                  {/* Item Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100 truncate">
                        {item.name}
                      </h4>
                      {item.isFuel && (
                        <span className="inline-block bg-fuel-100 dark:bg-fuel-900/30 text-fuel-700 dark:text-fuel-300 px-2 py-1 rounded text-xs font-medium mt-1">
                          FUEL
                        </span>
                      )}
                      <div className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:text-danger-400 dark:hover:text-danger-300 dark:hover:bg-danger-900/20 ml-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </Button>
                      
                      <span className="w-12 text-center font-medium text-secondary-900 dark:text-secondary-100">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-lg text-secondary-900 dark:text-secondary-100">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Totals & Checkout */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border-t border-secondary-200 dark:border-secondary-700 p-6"
          >
            {/* Totals Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-secondary-700 dark:text-secondary-300">
                <span>Subtotal ({itemCount} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-secondary-700 dark:text-secondary-300">
                <span>Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="h-px bg-secondary-200 dark:bg-secondary-700" />
              
              <div className="flex justify-between text-xl font-bold text-secondary-900 dark:text-secondary-100">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onCheckout}
              icon={<CreditCardIcon className="w-5 h-5" />}
            >
              Proceed to Checkout
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default Cart;