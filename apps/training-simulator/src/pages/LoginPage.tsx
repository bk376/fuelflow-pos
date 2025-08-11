import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../stores/authStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('trainee@gasstation.com');
  const [password, setPassword] = useState('train123');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative overflow-hidden"
    >
      {/* Card Background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-3xl"></div>
      
      <div className="relative p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/90">
              Training Account Email
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                placeholder="Enter your training email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/90">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl"></div>
              <div className="relative p-4 text-red-200 text-sm font-medium">
                {error}
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Start Training Session
                </span>
              )}
            </div>
          </motion.button>

          {/* Demo Credentials */}
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/70 text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-sm">
              <p><span className="text-white/60">Email:</span> <span className="text-purple-200 font-mono">trainee@gasstation.com</span></p>
              <p><span className="text-white/60">Password:</span> <span className="text-purple-200 font-mono">train123</span></p>
            </div>
          </div>
        </form>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-8 border-t border-white/20"
        >
          <h3 className="text-white font-bold mb-6 text-center">🎯 What You'll Master:</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">💳</span>
              </div>
              <div>
                <div className="text-white font-medium text-sm">POS Systems</div>
                <div className="text-white/60 text-xs">Master transactions</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">⛽</span>
              </div>
              <div>
                <div className="text-white font-medium text-sm">Fuel Safety</div>
                <div className="text-white/60 text-xs">Critical protocols</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">🤝</span>
              </div>
              <div>
                <div className="text-white font-medium text-sm">Customer Service</div>
                <div className="text-white/60 text-xs">Excellence skills</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">🚨</span>
              </div>
              <div>
                <div className="text-white font-medium text-sm">Emergency Response</div>
                <div className="text-white/60 text-xs">Critical situations</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginPage;