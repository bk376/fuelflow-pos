import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Input, Button } from '@gas-station/ui-components';
import useAuthStore from '../stores/authStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, isLoading } = useAuthStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login({ 
        email, 
        password,
        locationId: 'loc-1' // Default location for demo
      });
    } catch (error) {
      setErrors({ 
        general: error instanceof Error ? error.message : 'Login failed. Please try again.' 
      });
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@gasstation.com');
    setPassword('demo123');
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white border-opacity-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-danger-500 bg-opacity-20 border border-danger-500 border-opacity-30 text-danger-100 px-4 py-3 rounded-xl text-sm"
            >
              {errors.general}
            </motion.div>
          )}

          {/* Email Field */}
          <div>
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              icon={<UserIcon className="w-5 h-5" />}
              required
              size="lg"
              className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              icon={<LockClosedIcon className="w-5 h-5" />}
              required
              size="lg"
              className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60 pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-12 text-white text-opacity-60 hover:text-opacity-90 transition-opacity"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            variant="primary"
            size="xl"
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 hover:border-opacity-50"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In to POS Terminal'}
          </Button>

          {/* Demo Login */}
          <div className="text-center">
            <p className="text-white text-opacity-70 text-sm mb-3">
              Don't have credentials? Try the demo:
            </p>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleDemoLogin}
              className="text-white hover:bg-white hover:bg-opacity-10 border border-white border-opacity-20"
            >
              Use Demo Account
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center pt-4">
            <p className="text-white text-opacity-60 text-sm">
              Need help? Contact your system administrator
            </p>
          </div>
        </form>
      </div>

      {/* Features Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-8 text-center"
      >
        <div className="grid grid-cols-3 gap-4 text-white text-opacity-80">
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm font-medium">Lightning Fast</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-sm font-medium">Secure</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-medium">Touch Optimized</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;