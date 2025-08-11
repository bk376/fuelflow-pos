import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FuelSafetyGame: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 text-center"
      >
        <div className="text-6xl mb-4">⛽</div>
        <h1 className="text-3xl font-bold text-white mb-4">Fuel Safety Training</h1>
        <p className="text-white/80 mb-6">
          This advanced safety training module is currently in development.
          Master critical fuel handling and safety procedures.
        </p>
        
        <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-4 mb-6">
          <p className="text-orange-200 text-sm">
            🚧 Coming Soon - Advanced safety scenarios including spill response,
            emergency procedures, and hazard identification.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all"
        >
          Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default FuelSafetyGame;