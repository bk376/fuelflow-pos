import React from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Card } from '@gas-station/ui-components';

// Mock data for dashboard
const mockData = {
  todayStats: {
    revenue: 12847.50,
    transactions: 234,
    fuelSales: 8945.20,
    customers: 187
  },
  recentTransactions: [
    { id: 'TXN-001', time: '10:34 AM', amount: 67.45, type: 'Fuel + Store', customer: 'Cash' },
    { id: 'TXN-002', time: '10:31 AM', amount: 34.20, type: 'Regular', customer: '****1234' },
    { id: 'TXN-003', time: '10:28 AM', amount: 15.99, type: 'Store Items', customer: '****5678' },
    { id: 'TXN-004', time: '10:25 AM', amount: 89.10, type: 'Premium', customer: 'Cash' },
    { id: 'TXN-005', time: '10:22 AM', amount: 42.35, type: 'Plus + Store', customer: '****9012' }
  ],
  alerts: [
    { type: 'warning', message: 'Tank 2 (Regular) is at 20% capacity', time: '15 min ago' },
    { type: 'info', message: 'Pump 4 maintenance scheduled for tomorrow', time: '1 hour ago' },
    { type: 'warning', message: 'Low inventory: Coca-Cola 20oz (5 units)', time: '2 hours ago' }
  ],
  pumpStatus: [
    { id: 1, status: 'active', grade: 'Regular', customers: 2 },
    { id: 2, status: 'active', grade: 'Plus', customers: 1 },
    { id: 3, status: 'maintenance', grade: 'Premium', customers: 0 },
    { id: 4, status: 'active', grade: 'Diesel', customers: 3 },
    { id: 5, status: 'idle', grade: 'Regular', customers: 0 },
    { id: 6, status: 'active', grade: 'Plus', customers: 1 }
  ]
};

const StatCard: React.FC<{
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600',
    green: 'bg-green-500 text-green-600',
    purple: 'bg-purple-500 text-purple-600',
    orange: 'bg-orange-500 text-orange-600'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {value}
          </p>
          <div className="flex items-center mt-2">
            {change >= 0 ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}% vs yesterday
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[1]}`} />
        </div>
      </div>
    </Card>
  );
};

const Overview: React.FC = () => {
  const { todayStats, recentTransactions, alerts, pumpStatus } = mockData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Dashboard Overview
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Real-time business performance and operations
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Today's Revenue"
            value={`$${todayStats.revenue.toLocaleString()}`}
            change={12.5}
            icon={CurrencyDollarIcon}
            color="green"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Transactions"
            value={todayStats.transactions.toString()}
            change={8.2}
            icon={ShoppingCartIcon}
            color="blue"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Fuel Sales"
            value={`$${todayStats.fuelSales.toLocaleString()}`}
            change={-3.1}
            icon={TruckIcon}
            color="orange"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Customers"
            value={todayStats.customers.toString()}
            change={15.7}
            icon={UsersIcon}
            color="purple"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Recent Transactions
              </h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {transaction.id}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {transaction.type} • {transaction.customer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {transaction.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Alerts & Pump Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {/* Alerts */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              System Alerts
            </h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    alert.type === 'warning' 
                      ? 'bg-warning-50 dark:bg-warning-900/20' 
                      : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <ExclamationTriangleIcon 
                    className={`w-4 h-4 mt-0.5 ${
                      alert.type === 'warning' ? 'text-warning-600' : 'text-blue-600'
                    }`} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-secondary-800 dark:text-secondary-200">
                      {alert.message}
                    </p>
                    <div className="flex items-center mt-1">
                      <ClockIcon className="w-3 h-3 text-secondary-400 mr-1" />
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Pump Status */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Pump Status
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {pumpStatus.map((pump, index) => (
                <motion.div
                  key={pump.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    pump.status === 'active'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : pump.status === 'maintenance'
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                      : 'bg-secondary-50 dark:bg-secondary-700/50 border-secondary-200 dark:border-secondary-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      Pump {pump.id}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      pump.status === 'active' ? 'bg-green-500' : 
                      pump.status === 'maintenance' ? 'bg-orange-500' : 'bg-secondary-400'
                    }`} />
                  </div>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1">
                    {pump.grade}
                  </p>
                  <p className="text-xs text-secondary-600 dark:text-secondary-300">
                    {pump.customers} customer{pump.customers !== 1 ? 's' : ''}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;