import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { CartState, CartItem } from '@gas-station/types';

const TAX_RATE = 0.0875; // 8.75% tax rate

const useCartStore = create<CartState>()(
  subscribeWithSelector((set, get) => ({
    items: [],
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,

    addItem: (item: CartItem) => {
      const { items } = get();
      const existingItem = items.find(i => i.id === item.id);

      let newItems: CartItem[];
      
      if (existingItem) {
        // Update quantity of existing item
        newItems = items.map(i =>
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Add new item
        newItems = [...items, item];
      }

      const subtotal = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const taxAmount = subtotal * TAX_RATE;
      const totalAmount = subtotal + taxAmount;

      set({
        items: newItems,
        subtotal,
        taxAmount,
        totalAmount,
      });
    },

    removeItem: (itemId: string) => {
      const { items } = get();
      const newItems = items.filter(item => item.id !== itemId);
      
      const subtotal = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const taxAmount = subtotal * TAX_RATE;
      const totalAmount = subtotal + taxAmount;

      set({
        items: newItems,
        subtotal,
        taxAmount,
        totalAmount,
      });
    },

    updateQuantity: (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        get().removeItem(itemId);
        return;
      }

      const { items } = get();
      const newItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );

      const subtotal = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const taxAmount = subtotal * TAX_RATE;
      const totalAmount = subtotal + taxAmount;

      set({
        items: newItems,
        subtotal,
        taxAmount,
        totalAmount,
      });
    },

    clearCart: () => {
      set({
        items: [],
        subtotal: 0,
        taxAmount: 0,
        totalAmount: 0,
      });
    },
  }))
);

export default useCartStore;