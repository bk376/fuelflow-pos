import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CubeIcon,
  BeakerIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@gas-station/ui-components';
import useAuthStore from '../stores/authStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/', icon: HomeIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Locations', href: '/locations', icon: BuildingOfficeIcon },
  { name: 'Employees', href: '/employees', icon: UsersIcon },
  { name: 'Inventory', href: '/inventory', icon: CubeIcon },
  { name: 'Fuel Management', href: '/fuel', icon: BeakerIcon },
  { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-secondary-600 opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ 
          x: sidebarOpen ? 0 : -300,
          transition: { type: 'spring', damping: 30, stiffness: 300 }
        }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-800 shadow-xl lg:relative lg:translate-x-0 lg:transition-none"
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  FuelFlow POS
                </h1>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  Manager Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100'
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-2 w-1 h-6 bg-primary-600 rounded-full"
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                <UserCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                  {user?.locations?.[0]?.location.name}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="flex-1"
              >
                {darkMode ? (
                  <SunIcon className="w-4 h-4" />
                ) : (
                  <MoonIcon className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex-1"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              
              <div className="ml-4 lg:ml-0">
                <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  {user?.locations?.[0]?.location.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 relative">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3 hidden md:block">
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Manager
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;