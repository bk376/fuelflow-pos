import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

// Stores
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';

// Components
import { Button } from '@gas-station/ui-components';

interface POSLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: 'POS Terminal',
    href: '/',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    name: 'Fuel Manager',
    href: '/fuel',
    icon: CreditCardIcon,
    activeIcon: CreditCardIconSolid,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: ClipboardDocumentListIcon,
    activeIcon: ClipboardDocumentListIconSolid,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    activeIcon: Cog6ToothIconSolid,
  },
];

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { totalAmount } = useCartStore();

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen bg-secondary-50 dark:bg-secondary-900 flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:bg-white lg:dark:bg-secondary-800 lg:border-r lg:border-secondary-200 lg:dark:border-secondary-700">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.84 0 1.58-.41 2.03-1.03L19.77 7.23zM9.5 11.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 truncate">
              Gas Station POS
            </h1>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {user?.locations?.[0]?.location.name}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = isActive ? item.activeIcon : item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {item.name}
                    {isActive && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-secondary-200 dark:border-secondary-700 p-4">
          <div className="flex items-center gap-3 mb-4">
            <UserCircleIcon className="w-8 h-8 text-secondary-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                {user?.locations?.[0]?.role.name}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:text-danger-400 dark:hover:text-danger-300 dark:hover:bg-danger-900/20"
            icon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              icon={<Bars3Icon className="w-5 h-5" />}
            >
            </Button>

            {/* Date & Time */}
            <div className="hidden sm:flex flex-col items-center text-center">
              <div className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {currentTime}
              </div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">
                {currentDate}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Cart Total */}
              {totalAmount > 0 && (
                <motion.div
                  className="bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200 px-3 py-1 rounded-full text-sm font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  Cart: ${totalAmount.toFixed(2)}
                </motion.div>
              )}

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                icon={<BellIcon className="w-5 h-5" />}
              >
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full animate-pulse"></span>
              </Button>

              {/* Mobile user info */}
              <div className="lg:hidden flex items-center gap-2">
                <UserCircleIcon className="w-8 h-8 text-secondary-400" />
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  {user?.firstName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="lg:hidden fixed inset-y-0 left-0 w-80 max-w-full bg-white dark:bg-secondary-800 z-50 flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.84 0 1.58-.41 2.03-1.03L19.77 7.23z"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                      Gas Station POS
                    </h1>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {user?.locations?.[0]?.location.name}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  icon={<XMarkIcon className="w-5 h-5" />}
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = isActive ? item.activeIcon : item.icon;
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                          isActive
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                            : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                        )
                      }
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Mobile User Info */}
              <div className="border-t border-secondary-200 dark:border-secondary-700 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <UserCircleIcon className="w-8 h-8 text-secondary-400" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {user?.locations?.[0]?.role.name}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:text-danger-400"
                  icon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                >
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default POSLayout;