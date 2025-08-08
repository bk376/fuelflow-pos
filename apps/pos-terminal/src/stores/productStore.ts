import { create } from 'zustand';
import type { Product, Category } from '@gas-station/types';

interface ProductState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getCategoryById: (id: string) => Category | undefined;
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (categoryId: string) => Product[];
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock products data
      const mockProducts: Product[] = [
        // Beverages
        {
          id: 'prod-1',
          tenantId: 'tenant-1',
          categoryId: 'cat-beverages',
          sku: 'BEV-COKE-20',
          name: 'Coca-Cola 20oz',
          description: 'Classic Coca-Cola in 20oz bottle',
          brand: 'Coca-Cola',
          unitType: 'bottle',
          barcode: '049000028436',
          isFuel: false,
          isAgeRestricted: false,
          minAge: 0,
          isTaxable: true,
          costPrice: 1.20,
          retailPrice: 2.49,
          marginPercent: 51.8,
          status: 'active',
          attributes: { size: '20oz', carbonated: true },
        },
        {
          id: 'prod-2',
          tenantId: 'tenant-1',
          categoryId: 'cat-beverages',
          sku: 'BEV-PEPSI-20',
          name: 'Pepsi 20oz',
          description: 'Pepsi Cola in 20oz bottle',
          brand: 'Pepsi',
          unitType: 'bottle',
          barcode: '012000000355',
          isFuel: false,
          isAgeRestricted: false,
          minAge: 0,
          isTaxable: true,
          costPrice: 1.18,
          retailPrice: 2.49,
          marginPercent: 52.6,
          status: 'active',
          attributes: { size: '20oz', carbonated: true },
        },
        {
          id: 'prod-3',
          tenantId: 'tenant-1',
          categoryId: 'cat-beverages',
          sku: 'BEV-WATER-16',
          name: 'Aquafina Water 16.9oz',
          description: 'Pure water in convenient bottle',
          brand: 'Aquafina',
          unitType: 'bottle',
          barcode: '012000001390',
          isFuel: false,
          isAgeRestricted: false,
          minAge: 0,
          isTaxable: true,
          costPrice: 0.45,
          retailPrice: 1.99,
          marginPercent: 77.4,
          status: 'active',
          attributes: { size: '16.9oz', type: 'purified' },
        },
        
        // Snacks
        {
          id: 'prod-4',
          tenantId: 'tenant-1',
          categoryId: 'cat-snacks',
          sku: 'SNK-CHIPS-LAY',
          name: 'Lays Classic Chips',
          description: 'Original flavored potato chips',
          brand: 'Lays',
          unitType: 'bag',
          barcode: '028400047036',
          isFuel: false,
          isAgeRestricted: false,
          minAge: 0,
          isTaxable: true,
          costPrice: 2.10,
          retailPrice: 3.99,
          marginPercent: 47.4,
          status: 'active',
          attributes: { flavor: 'original', size: 'family' },
        },
        {
          id: 'prod-5',
          tenantId: 'tenant-1',
          categoryId: 'cat-snacks',
          sku: 'SNK-CANDY-MNM',
          name: 'M&Ms Peanut',
          description: 'Chocolate candies with peanuts',
          brand: 'Mars',
          unitType: 'bag',
          barcode: '040000000136',
          isFuel: false,
          isAgeRestricted: false,
          minAge: 0,
          isTaxable: true,
          costPrice: 0.89,
          retailPrice: 1.79,
          marginPercent: 50.3,
          status: 'active',
          attributes: { type: 'peanut', size: 'standard' },
        },
        
        // Tobacco (Age Restricted)
        {
          id: 'prod-6',
          tenantId: 'tenant-1',
          categoryId: 'cat-tobacco',
          sku: 'TOB-MARL-GOLD',
          name: 'Marlboro Gold',
          description: 'Marlboro Gold cigarettes',
          brand: 'Marlboro',
          unitType: 'pack',
          barcode: '028200003546',
          isFuel: false,
          isAgeRestricted: true,
          minAge: 21,
          isTaxable: true,
          taxCategory: 'tobacco',
          costPrice: 7.50,
          retailPrice: 9.99,
          marginPercent: 24.9,
          status: 'active',
          attributes: { type: 'light', count: 20 },
        },
        
        // Automotive
        {
          id: 'prod-7',
          tenantId: 'tenant-1',
          categoryId: 'cat-automotive',
          sku: 'AUTO-OIL-5W30',
          name: 'Mobil 1 5W-30 Motor Oil',
          description: 'Full synthetic motor oil',
          brand: 'Mobil 1',
          unitType: 'quart',
          barcode: '071924078048',
          isFuel: false,
          isAgeRestricted: false,
          minAge: 0,
          isTaxable: true,
          costPrice: 6.25,
          retailPrice: 8.99,
          marginPercent: 30.5,
          status: 'active',
          attributes: { viscosity: '5W-30', type: 'synthetic' },
        },
        
        // Food Service
        {
          id: 'prod-8',
          tenantId: 'tenant-1',
          categoryId: 'cat-food',
          sku: 'FOOD-HOT-DOG',
          name: 'Roller Grill Hot Dog',
          description: 'Fresh hot dog from roller grill',
          brand: 'Store Brand',
          unitType: 'each',
          isFuel: false,
          isAgeRestricted: false,
          minAge: 0,
          isTaxable: true,
          costPrice: 0.75,
          retailPrice: 1.99,
          marginPercent: 62.3,
          status: 'active',
          attributes: { type: 'beef', fresh: true },
        },
        {
          id: 'prod-9',
          tenantId: 'tenant-1',
          categoryId: 'cat-food',
          sku: 'FOOD-COFFEE-12',
          name: 'Fresh Brewed Coffee 12oz',
          description: 'Freshly brewed coffee',
          brand: 'Store Brand',
          unitType: 'cup',
          isFuel: false,
          isAgeRestricted: false,
          minAge: 0,
          isTaxable: true,
          costPrice: 0.35,
          retailPrice: 1.49,
          marginPercent: 76.5,
          status: 'active',
          attributes: { size: '12oz', temperature: 'hot' },
        },
      ];

      set({ products: mockProducts, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock categories data
      const mockCategories: Category[] = [
        {
          id: 'cat-fuel',
          tenantId: 'tenant-1',
          name: 'Fuel',
          description: 'Gasoline and diesel fuel products',
          isFuel: true,
          displayOrder: 1,
          status: 'active',
        },
        {
          id: 'cat-beverages',
          tenantId: 'tenant-1',
          name: 'Beverages',
          description: 'Soft drinks, water, energy drinks',
          isFuel: false,
          displayOrder: 2,
          status: 'active',
        },
        {
          id: 'cat-snacks',
          tenantId: 'tenant-1',
          name: 'Snacks',
          description: 'Chips, candy, nuts, and other snacks',
          isFuel: false,
          displayOrder: 3,
          status: 'active',
        },
        {
          id: 'cat-tobacco',
          tenantId: 'tenant-1',
          name: 'Tobacco',
          description: 'Cigarettes and tobacco products',
          isFuel: false,
          displayOrder: 4,
          status: 'active',
        },
        {
          id: 'cat-automotive',
          tenantId: 'tenant-1',
          name: 'Automotive',
          description: 'Motor oil, car care products',
          isFuel: false,
          displayOrder: 5,
          status: 'active',
        },
        {
          id: 'cat-food',
          tenantId: 'tenant-1',
          name: 'Food Service',
          description: 'Hot food, coffee, prepared items',
          isFuel: false,
          displayOrder: 6,
          status: 'active',
        },
      ];

      set({ categories: mockCategories, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getProductById: (id: string) => {
    return get().products.find(product => product.id === id);
  },

  getCategoryById: (id: string) => {
    return get().categories.find(category => category.id === id);
  },

  searchProducts: (query: string) => {
    const { products } = get();
    const searchTerm = query.toLowerCase();
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.barcode?.includes(query)
    );
  },

  getProductsByCategory: (categoryId: string) => {
    const { products } = get();
    return products.filter(product => product.categoryId === categoryId);
  },
}));

// Initialize data
useProductStore.getState().fetchProducts();
useProductStore.getState().fetchCategories();

export default useProductStore;