import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FuelPump } from '@gas-station/ui-components';
import { FuelDispenser } from '@gas-station/types';

// Stores
import useFuelStore from '../stores/fuelStore';

const FuelManager: React.FC = () => {
  const { dispensers, activeFuelSales, authorizePump, completeFuelSale } = useFuelStore();
  const [selectedDispenser, setSelectedDispenser] = useState<string | null>(null);

  const handleAuthorize = async (dispenserId: string, amount: number) => {
    try {
      await authorizePump(dispenserId, amount);
      setSelectedDispenser(dispenserId);
    } catch (error) {
      console.error('Failed to authorize pump:', error);
      // In a real app, show error notification
    }
  };

  const handleStop = async (dispenserId: string) => {
    const activeSale = activeFuelSales.find(sale => sale.dispenserId === dispenserId);
    if (activeSale) {
      try {
        await completeFuelSale(activeSale.id);
      } catch (error) {
        console.error('Failed to stop fuel sale:', error);
      }
    }
  };

  const getActiveSaleForDispenser = (dispenserId: string) => {
    const sale = activeFuelSales.find(sale => sale.dispenserId === dispenserId);
    if (!sale) return undefined;
    
    return {
      amount: sale.currentAmount,
      gallons: sale.gallons,
      pricePerGallon: sale.pricePerGallon,
    };
  };

  return (
    <div className="h-full p-6 bg-secondary-50 dark:bg-secondary-900 overflow-y-auto pos-scroll">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Fuel Management
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Monitor and control fuel dispensers in real-time
          </p>
        </motion.div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Pumps</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {dispensers.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.84 0 1.58-.41 2.03-1.03L19.77 7.23z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Active Sales</p>
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {activeFuelSales.filter(sale => sale.status === 'dispensing').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Online</p>
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {dispensers.filter(d => d.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Maintenance</p>
                <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                  {dispensers.filter(d => d.status === 'maintenance').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fuel Pumps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dispensers.map((dispenser: FuelDispenser, index) => (
            <motion.div
              key={dispenser.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <FuelPump
                dispenser={dispenser}
                isActive={selectedDispenser === dispenser.id}
                currentSale={getActiveSaleForDispenser(dispenser.id)}
                onAuthorize={handleAuthorize}
                onStop={handleStop}
              />
            </motion.div>
          ))}
        </div>

        {/* Emergency Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-danger-800 dark:text-danger-200 mb-1">
                Emergency Controls
              </h3>
              <p className="text-danger-600 dark:text-danger-400 text-sm">
                Use in case of emergency to stop all fuel dispensing immediately
              </p>
            </div>
            <button className="bg-danger-600 hover:bg-danger-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg">
              Emergency Stop All
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FuelManager;