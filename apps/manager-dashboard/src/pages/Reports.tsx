import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@gas-station/ui-components';
import { DocumentChartBarIcon } from '@heroicons/react/24/outline';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Reports & Analytics
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Generate detailed business reports and compliance documents
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-12 text-center">
          <DocumentChartBarIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
            Advanced Reporting System
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            Comprehensive reporting and analytics features coming soon
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;