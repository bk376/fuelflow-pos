import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardDocumentListIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const TransactionHistory: React.FC = () => {
  // Mock transaction data
  const transactions = [
    {
      id: 'txn-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      type: 'sale',
      total: 45.67,
      paymentMethod: 'credit',
      items: 3,
      customer: null,
    },
    {
      id: 'txn-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 32), // 32 minutes ago
      type: 'sale',
      total: 78.90,
      paymentMethod: 'cash',
      items: 1,
      customer: null,
    },
    {
      id: 'txn-003',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      type: 'sale',
      total: 12.34,
      paymentMethod: 'credit',
      items: 2,
      customer: 'John Doe',
    },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'credit':
      case 'debit':
        return <CreditCardIcon className="w-5 h-5" />;
      case 'cash':
        return <BanknotesIcon className="w-5 h-5" />;
      default:
        return <CreditCardIcon className="w-5 h-5" />;
    }
  };

  const todayTotal = transactions.reduce((sum, txn) => sum + txn.total, 0);
  const todayCount = transactions.length;

  return (
    <div className="h-full p-6 bg-secondary-50 dark:bg-secondary-900 overflow-y-auto pos-scroll">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Transaction History
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            View and manage recent transactions
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Today's Sales</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  ${todayTotal.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Transactions</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {todayCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <ClipboardDocumentListIcon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Avg. Sale</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  ${todayCount > 0 ? (todayTotal / todayCount).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              Recent Transactions
            </h3>
          </div>

          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="px-6 py-4 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                      {getPaymentIcon(transaction.paymentMethod)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-secondary-900 dark:text-secondary-100">
                          Transaction {transaction.id}
                        </p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300">
                          {transaction.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                        <span>{formatTime(transaction.timestamp)}</span>
                        <span>•</span>
                        <span>{transaction.items} item{transaction.items !== 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span className="capitalize">{transaction.paymentMethod}</span>
                        {transaction.customer && (
                          <>
                            <span>•</span>
                            <span>{transaction.customer}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                      ${transaction.total.toFixed(2)}
                    </p>
                    <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="px-6 py-12 text-center">
              <ClipboardDocumentListIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600 dark:text-secondary-400">
                No transactions found
              </p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex gap-4"
        >
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg">
            Print Report
          </button>
          <button className="bg-secondary-200 hover:bg-secondary-300 dark:bg-secondary-700 dark:hover:bg-secondary-600 text-secondary-900 dark:text-secondary-100 px-6 py-3 rounded-xl font-medium transition-colors">
            Export Data
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TransactionHistory;