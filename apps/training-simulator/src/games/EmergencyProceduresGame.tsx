import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EmergencyProceduresGame: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 text-center"
      >
        <div className="text-6xl mb-4">🚨</div>
        <h1 className="text-3xl font-bold text-white mb-4">Emergency Response Training</h1>
        <p className="text-white/80 mb-6">
          This critical emergency procedures training module is currently in development.
          Learn to handle fires, medical emergencies, and security incidents.
        </p>
        
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
          <p className="text-red-200 text-sm">
            🚧 Coming Soon - High-stakes scenarios including fire response,
            medical emergencies, evacuations, and incident documentation.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all"
        >
          Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default EmergencyProceduresGame;