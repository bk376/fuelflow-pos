import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@gas-station/ui-components';
import { BeakerIcon } from '@heroicons/react/24/outline';

const FuelManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Fuel Management
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Monitor tank levels, manage pricing, and track fuel deliveries
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-12 text-center">
          <BeakerIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
            Fuel Management System
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            Comprehensive fuel monitoring and management features coming soon
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default FuelManagement;