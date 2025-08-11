import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@gas-station/ui-components';
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Business Analytics
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Comprehensive sales and performance insights
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700">
            <CalendarIcon className="w-4 h-4" />
            Last 30 days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { title: 'Revenue Trends', icon: ArrowTrendingUpIcon, color: 'green' },
          { title: 'Sales by Category', icon: ChartBarIcon, color: 'blue' },
          { title: 'Peak Hours Analysis', icon: ClockIcon, color: 'purple' },
          { title: 'Customer Insights', icon: ChartBarIcon, color: 'orange' },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 text-center">
              <div className={`p-3 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/20 inline-block mb-4`}>
                <item.icon className={`w-6 h-6 text-${item.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                {item.title}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                Coming soon with advanced charts and insights
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;