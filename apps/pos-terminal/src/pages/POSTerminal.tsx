import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductGrid, Cart, PaymentTerminal } from '@gas-station/ui-components';
import { Product, Payment } from '@gas-station/types';

// Stores
import useCartStore from '../stores/cartStore';
import useProductStore from '../stores/productStore';

const POSTerminal: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const { products, categories } = useProductStore();
  const { items, subtotal, taxAmount, totalAmount, addItem, updateQuantity, removeItem, clearCart } = useCartStore();

  const handleProductSelect = (product: Product) => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.retailPrice,
      quantity: 1,
      isFuel: product.isFuel,
      metadata: {
        sku: product.sku,
        brand: product.brand,
        unitType: product.unitType,
      },
    });
  };

  const handleCheckout = () => {
    if (totalAmount > 0) {
      setIsCheckoutOpen(true);
    }
  };

  const handlePaymentComplete = (payment: Payment) => {
    console.log('Payment completed:', payment);
    
    // Clear cart and close checkout
    clearCart();
    setIsCheckoutOpen(false);
    
    // In a real app, you would:
    // 1. Create transaction record
    // 2. Print receipt
    // 3. Update inventory
    // 4. Send to accounting system
  };

  const handlePaymentCancel = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <div className="h-full flex bg-secondary-50 dark:bg-secondary-900">
      {/* Product Selection Area */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6">
          <div className="h-full overflow-y-auto pos-scroll">
            <ProductGrid
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onProductSelect={handleProductSelect}
              searchPlaceholder="Search products or scan barcode..."
            />
          </div>
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-96 p-6 flex-shrink-0">
        <Cart
          items={items}
          subtotal={subtotal}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          className="h-full"
        />
      </div>

      {/* Payment Modal */}
      {isCheckoutOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <PaymentTerminal
              totalAmount={totalAmount}
              onPaymentComplete={handlePaymentComplete}
              onCancel={handlePaymentCancel}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default POSTerminal;