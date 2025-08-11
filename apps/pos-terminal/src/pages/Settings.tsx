import React from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  BellIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Card, Button } from '@gas-station/ui-components';

const Settings: React.FC = () => {
  const settingsGroups = [
    {
      title: 'Appearance',
      icon: <SunIcon className="w-5 h-5" />,
      settings: [
        {
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          options: [
            { label: 'Light', icon: <SunIcon className="w-4 h-4" />, value: 'light' },
            { label: 'Dark', icon: <MoonIcon className="w-4 h-4" />, value: 'dark' },
            { label: 'System', icon: <ComputerDesktopIcon className="w-4 h-4" />, value: 'system' },
          ],
          current: 'system',
        },
        {
          label: 'Language',
          description: 'Select your preferred language',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
          ],
          current: 'en',
        },
      ],
    },
    {
      title: 'Terminal',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      settings: [
        {
          label: 'Receipt Printer',
          description: 'Configure receipt printing options',
          toggle: true,
          enabled: true,
        },
        {
          label: 'Auto-logout',
          description: 'Automatically log out after inactivity',
          options: [
            { label: '15 minutes', value: '15' },
            { label: '30 minutes', value: '30' },
            { label: '1 hour', value: '60' },
            { label: 'Never', value: 'never' },
          ],
          current: '30',
        },
        {
          label: 'Sound Effects',
          description: 'Play sounds for button presses and notifications',
          toggle: true,
          enabled: true,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <BellIcon className="w-5 h-5" />,
      settings: [
        {
          label: 'Low Inventory Alerts',
          description: 'Get notified when products are running low',
          toggle: true,
          enabled: true,
        },
        {
          label: 'Payment Failures',
          description: 'Alert on payment processing issues',
          toggle: true,
          enabled: true,
        },
        {
          label: 'System Updates',
          description: 'Notifications for system updates and maintenance',
          toggle: true,
          enabled: false,
        },
      ],
    },
    {
      title: 'Security',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      settings: [
        {
          label: 'PIN Required',
          description: 'Require PIN for sensitive operations',
          toggle: true,
          enabled: true,
        },
        {
          label: 'Manager Override',
          description: 'Require manager approval for voids and refunds',
          toggle: true,
          enabled: true,
        },
        {
          label: 'Age Verification',
          description: 'Automatically prompt for ID verification',
          toggle: true,
          enabled: true,
        },
      ],
    },
  ];

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
            Settings
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Configure your POS terminal preferences and system settings
          </p>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card padding="lg" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">John Doe</h3>
                <p className="text-primary-100 mb-2">Cashier • Main Street Gas Station</p>
                <p className="text-primary-200 text-sm">Last login: Today at 8:30 AM</p>
              </div>
              <Button variant="ghost" className="text-white border-white border-opacity-30 hover:bg-white hover:bg-opacity-10">
                Edit Profile
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (groupIndex + 2) }}
            >
              <Card padding="none" className="overflow-hidden">
                {/* Group Header */}
                <div className="px-6 py-4 bg-secondary-50 dark:bg-secondary-750 border-b border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600">
                      {group.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                      {group.title}
                    </h3>
                  </div>
                </div>

                {/* Settings Items */}
                <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {group.settings.map((setting, settingIndex) => (
                    <div key={setting.label} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-1">
                            {setting.label}
                          </h4>
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            {setting.description}
                          </p>
                        </div>

                        <div className="ml-6">
                          {(setting as any).toggle ? (
                            <div className="flex items-center">
                              <button
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  (setting as any).enabled
                                    ? 'bg-primary-600'
                                    : 'bg-secondary-300 dark:bg-secondary-600'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    (setting as any).enabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ) : (setting as any).options ? (
                            <select
                              className="input-base input-sm w-40"
                              value={setting.current}
                              onChange={() => {}}
                            >
                              {((setting as any).options || []).map((option: any) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : null}
                        </div>
                      </div>

                      {/* Special UI for theme options */}
                      {setting.label === 'Theme' && setting.options && (
                        <div className="mt-4 flex gap-3">
                          {setting.options.map((option) => (
                            <button
                              key={option.value}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                setting.current === option.value
                                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600'
                              }`}
                            >
                              {(option as any).icon}
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex gap-4"
        >
          <Button variant="primary" size="lg">
            Save Settings
          </Button>
          <Button variant="secondary" size="lg">
            Reset to Defaults
          </Button>
        </motion.div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-secondary-500 dark:text-secondary-400"
        >
          <p>Gas Station POS Terminal v1.0.0 • August 2025</p>
          <p className="mt-1">System ID: TERM-001 • Location: Main Street</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;