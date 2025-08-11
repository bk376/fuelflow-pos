import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@gas-station/ui-components';
import useAuthStore from '../stores/authStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('manager@gasstation.com');
  const [password, setPassword] = useState('manager123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Manager Login
        </h2>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Access your dashboard and business analytics
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg"
        >
          <p className="text-sm text-danger-700 dark:text-danger-400 text-center">
            {error}
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            type="email"
            label="Email Address"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            icon={<UserIcon className="w-4 h-4" />}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              icon={<LockClosedIcon className="w-4 h-4" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading}
            disabled={!email || !password}
          >
            Sign In to Dashboard
          </Button>
        </motion.div>
      </form>

      {/* Demo Credentials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
      >
        <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
          Demo Credentials
        </h3>
        <div className="text-xs space-y-1 text-primary-700 dark:text-primary-300">
          <p><strong>Email:</strong> manager@gasstation.com</p>
          <p><strong>Password:</strong> manager123</p>
        </div>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">
          This is a demonstration of the manager dashboard with sample data.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;