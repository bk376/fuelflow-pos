import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  TagIcon,
  ExclamationTriangleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Product, Category } from '@gas-station/types';
import Card from './Card';
import Input from './Input';
import Button from './Button';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string | undefined) => void;
  onProductSelect?: (product: Product) => void;
  searchPlaceholder?: string;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  onProductSelect,
  searchPlaceholder = 'Search products...',
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => product.status === 'active');

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.categoryId === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.brand?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  const getProductImage = (product: Product) => {
    // In a real app, this would return the actual product image
    return `https://images.unsplash.com/photo-1600721391776-b5cd0e0e8aa4?w=200&h=200&fit=crop&crop=center&auto=format&q=60`;
  };

  const handleProductClick = (product: Product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleCategoryClick = (categoryId: string | undefined) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-secondary-900 pb-4">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={setSearchTerm}
          icon={<MagnifyingGlassIcon className="w-5 h-5" />}
          size="lg"
          className="shadow-lg"
        />
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleCategoryClick(undefined)}
          >
            All Products
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleCategoryClick(category.id)}
              icon={category.isFuel ? <TagIcon className="w-4 h-4" /> : undefined}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
            Products
          </h3>
          <span className="text-sm text-secondary-500 dark:text-secondary-400">
            {filteredProducts.length} items
          </span>
        </div>

        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              key="no-products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-secondary-400 dark:text-secondary-600 mb-4" />
              <p className="text-secondary-600 dark:text-secondary-400">
                No products found
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-500 mt-1">
                Try adjusting your search or category filter
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="products-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    layout: { duration: 0.3 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
                >
                  <Card
                    hover
                    padding="none"
                    onClick={() => handleProductClick(product)}
                    className="group overflow-hidden h-full"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-secondary-100 dark:bg-secondary-800">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWMTQwSDgwVjYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                        }}
                      />
                      
                      {/* Age Restricted Badge */}
                      {product.isAgeRestricted && (
                        <div className="absolute top-2 left-2 bg-warning-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <ExclamationTriangleIcon className="w-3 h-3" />
                          {product.minAge}+
                        </div>
                      )}
                      
                      {/* Fuel Badge */}
                      {product.isFuel && (
                        <div className="absolute top-2 right-2 bg-fuel-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          FUEL
                        </div>
                      )}
                      
                      {/* Popular/Featured Badge */}
                      {product.marginPercent > 30 && (
                        <div className="absolute bottom-2 left-2 bg-success-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <StarIcon className="w-3 h-3 fill-current" />
                          High Margin
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 space-y-2">
                      <div>
                        <h4 className="font-medium text-secondary-900 dark:text-secondary-100 line-clamp-2 text-sm">
                          {product.name}
                        </h4>
                        {product.brand && (
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                            {product.brand}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
                            ${product.retailPrice.toFixed(2)}
                          </div>
                          {product.costPrice < product.retailPrice && (
                            <div className="text-xs text-success-600 dark:text-success-400">
                              {product.marginPercent.toFixed(1)}% margin
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-secondary-500 dark:text-secondary-400 uppercase">
                            {product.unitType}
                          </div>
                          <div className="text-xs font-mono text-secondary-400 dark:text-secondary-500">
                            {product.sku}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductGrid;