import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@gas-station/ui-components';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Mock location data
const locations = [
  {
    id: '1',
    name: 'Main Street Station',
    code: 'MAIN001',
    address: '123 Main Street, Springfield, IL 62701',
    phone: '+1-555-0123',
    status: 'active',
    manager: 'John Manager',
    revenue: 15430.50,
    pumps: 6,
    issues: 0
  },
  {
    id: '2',
    name: 'Highway 66 Express',
    code: 'HWY066',
    address: '456 Highway 66, Springfield, IL 62702',
    phone: '+1-555-0124',
    status: 'active',
    manager: 'Sarah Johnson',
    revenue: 22150.75,
    pumps: 8,
    issues: 1
  },
  {
    id: '3',
    name: 'Downtown Plaza',
    code: 'DOWN01',
    address: '789 Plaza Drive, Springfield, IL 62703',
    phone: '+1-555-0125',
    status: 'maintenance',
    manager: 'Mike Wilson',
    revenue: 8920.25,
    pumps: 4,
    issues: 3
  }
];

const Locations: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Location Management
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Monitor and manage all gas station locations
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                      {location.name}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {location.code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {location.status === 'active' ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                  )}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    location.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                  }`}>
                    {location.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  {location.address}
                </div>
                <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {location.phone}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Today's Revenue</p>
                  <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    ${location.revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Active Pumps</p>
                  <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {location.pumps - location.issues}/{location.pumps}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">Manager</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  {location.manager}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Locations;