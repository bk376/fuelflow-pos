import React from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SignalIcon,
  SignalSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/24/outline';
import { FuelDispenser, FuelNozzle } from '@gas-station/types';
import Card from './Card';
import Button from './Button';

interface FuelPumpProps {
  dispenser: FuelDispenser;
  isActive?: boolean;
  currentSale?: {
    amount: number;
    gallons: number;
    pricePerGallon: number;
  };
  onAuthorize?: (dispenserId: string, amount: number) => void;
  onStop?: (dispenserId: string) => void;
  className?: string;
}

const FuelPump: React.FC<FuelPumpProps> = ({
  dispenser,
  isActive = false,
  currentSale,
  onAuthorize,
  onStop,
  className,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-online';
      case 'maintenance':
        return 'status-warning';
      case 'offline':
        return 'status-error';
      default:
        return 'status-offline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <SignalIcon className="w-5 h-5" />;
      case 'maintenance':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'offline':
        return <SignalSlashIcon className="w-5 h-5" />;
      default:
        return <SignalSlashIcon className="w-5 h-5" />;
    }
  };

  const getFuelGradeClass = (grade: string) => {
    const gradeClasses = {
      regular: 'fuel-grade-regular',
      mid: 'fuel-grade-mid',
      premium: 'fuel-grade-premium',
      diesel: 'fuel-grade-diesel',
    };
    
    const normalizedGrade = grade.toLowerCase();
    if (normalizedGrade.includes('regular') || normalizedGrade.includes('87')) return gradeClasses.regular;
    if (normalizedGrade.includes('mid') || normalizedGrade.includes('89')) return gradeClasses.mid;
    if (normalizedGrade.includes('premium') || normalizedGrade.includes('91') || normalizedGrade.includes('93')) return gradeClasses.premium;
    if (normalizedGrade.includes('diesel')) return gradeClasses.diesel;
    return gradeClasses.regular;
  };

  const handleAuthorize = () => {
    if (onAuthorize && dispenser.status === 'active') {
      onAuthorize(dispenser.id, 100); // Default $100 authorization
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop(dispenser.id);
    }
  };

  return (
    <Card
      className={clsx(
        'relative overflow-hidden transition-all duration-300',
        {
          'ring-2 ring-primary-500 shadow-glow': isActive,
          'ring-2 ring-success-500 shadow-glow-success': currentSale,
        },
        className
      )}
      padding="md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              className={clsx(
                'w-3 h-3 rounded-full',
                getStatusColor(dispenser.status)
              )}
              animate={dispenser.status === 'maintenance' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              Pump {dispenser.dispenserNumber}
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 capitalize">
              {dispenser.status}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
          {getStatusIcon(dispenser.status)}
        </div>
      </div>

      {/* Fuel Grades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {dispenser.nozzles.map((nozzle: FuelNozzle) => (
          <motion.div
            key={nozzle.id}
            className={clsx(
              'rounded-lg p-3 text-center',
              getFuelGradeClass(nozzle.fuelGrade)
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div className="text-sm font-medium opacity-90">
              {nozzle.fuelGrade.toUpperCase()}
            </div>
            <div className="text-lg font-bold">
              ${nozzle.pricePerUnit.toFixed(3)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Sale Display */}
      <AnimatePresence>
        {currentSale && (
          <motion.div
            className="bg-success-50 dark:bg-success-900/20 rounded-xl p-4 mb-4 border border-success-200 dark:border-success-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-success-700 dark:text-success-300">
                Active Sale
              </span>
              <CheckCircleIcon className="w-5 h-5 text-success-600" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success-900 dark:text-success-100">
                  ${currentSale.amount.toFixed(2)}
                </div>
                <div className="text-xs text-success-600 dark:text-success-400">
                  Amount
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success-900 dark:text-success-100">
                  {currentSale.gallons.toFixed(2)}
                </div>
                <div className="text-xs text-success-600 dark:text-success-400">
                  Gallons
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-success-900 dark:text-success-100">
                  ${currentSale.pricePerGallon.toFixed(3)}
                </div>
                <div className="text-xs text-success-600 dark:text-success-400">
                  Per Gallon
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="flex gap-2">
        {!currentSale ? (
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            disabled={dispenser.status !== 'active'}
            onClick={handleAuthorize}
            icon={<PlayIcon className="w-4 h-4" />}
          >
            Authorize
          </Button>
        ) : (
          <Button
            variant="danger"
            size="md"
            className="flex-1"
            onClick={handleStop}
            icon={<StopIcon className="w-4 h-4" />}
          >
            Stop Sale
          </Button>
        )}
        
        <Button
          variant="secondary"
          size="md"
          className="px-3"
          disabled={dispenser.status !== 'active'}
        >
          {dispenser.status === 'maintenance' ? (
            <ExclamationTriangleIcon className="w-4 h-4" />
          ) : (
            <SignalIcon className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Maintenance Indicator */}
      <AnimatePresence>
        {dispenser.status === 'maintenance' && (
          <motion.div
            className="absolute top-2 right-2 bg-warning-500 text-white px-2 py-1 rounded-full text-xs font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Maintenance
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Pulse */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary-500 pointer-events-none"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 1, 0], scale: [1, 1.02, 1] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </AnimatePresence>
    </Card>
  );
};

export default FuelPump;