import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.84 0 1.58-.41 2.03-1.03L19.77 7.23z"/>
          </svg>
        </motion.div>
        
        <motion.h2
          className="text-xl font-semibold text-white mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading POS Terminal...
        </motion.h2>
        
        <motion.div
          className="w-48 h-1 bg-white bg-opacity-20 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;