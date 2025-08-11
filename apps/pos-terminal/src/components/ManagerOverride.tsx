import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldExclamationIcon,
  KeyIcon,
  XMarkIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { Button, Input } from '@gas-station/ui-components';

interface ManagerOverrideProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorized: (authorization: ManagerAuthorization) => void;
  reason: OverrideReason;
  transactionId?: string;
  amount?: number;
  description?: string;
}

export type OverrideReason = 
  | 'void_transaction'
  | 'void_item'
  | 'discount_override'
  | 'price_override'
  | 'return_no_receipt'
  | 'cash_drawer_open'
  | 'system_override'
  | 'age_verification_override';

interface ManagerAuthorization {
  authorized: boolean;
  managerId: string;
  managerName: string;
  reason: OverrideReason;
  timestamp: Date;
  transactionId?: string;
  amount?: number;
  notes?: string;
}

const OVERRIDE_REASONS = {
  void_transaction: {
    title: 'Void Transaction',
    description: 'Cancel entire transaction',
    icon: '🗑️',
    requiresAmount: true
  },
  void_item: {
    title: 'Void Item',
    description: 'Remove item from transaction',
    icon: '❌',
    requiresAmount: true
  },
  discount_override: {
    title: 'Discount Override',
    description: 'Apply unauthorized discount',
    icon: '💰',
    requiresAmount: true
  },
  price_override: {
    title: 'Price Override',
    description: 'Modify item price',
    icon: '🏷️',
    requiresAmount: true
  },
  return_no_receipt: {
    title: 'Return Without Receipt',
    description: 'Process return without receipt',
    icon: '📄',
    requiresAmount: true
  },
  cash_drawer_open: {
    title: 'Open Cash Drawer',
    description: 'Manual cash drawer access',
    icon: '💵',
    requiresAmount: false
  },
  system_override: {
    title: 'System Override',
    description: 'Override system restrictions',
    icon: '⚙️',
    requiresAmount: false
  },
  age_verification_override: {
    title: 'Age Verification Override',
    description: 'Override age verification requirement',
    icon: '🔞',
    requiresAmount: false
  }
};

export const ManagerOverride: React.FC<ManagerOverrideProps> = ({
  isOpen,
  onClose,
  onAuthorized,
  reason,
  transactionId,
  amount,
  description
}) => {
  const [step, setStep] = useState<'auth' | 'confirm' | 'success'>('auth');
  const [managerId, setManagerId] = useState('');
  const [managerPin, setManagerPin] = useState('');
  const [notes, setNotes] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const reasonConfig = OVERRIDE_REASONS[reason];

  const handleCancel = () => {
    onClose();
    setStep('auth');
    setManagerId('');
    setManagerPin('');
    setNotes('');
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);

    // Simulate manager authentication
    // In production, this would verify against actual manager credentials
    setTimeout(() => {
      if (managerId.length >= 3 && managerPin.length >= 4) {
        setStep('confirm');
      } else {
        alert('Invalid manager credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleAuthorize = () => {
    const authorization: ManagerAuthorization = {
      authorized: true,
      managerId,
      managerName: `Manager ${managerId}`, // This would come from user lookup
      reason,
      timestamp: new Date(),
      transactionId,
      amount,
      notes: notes || description
    };

    setStep('success');
    setTimeout(() => {
      onAuthorized(authorization);
      handleCancel();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={step === 'auth' ? onClose : undefined}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-warning-200 dark:border-warning-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Authentication Step */}
              {step === 'auth' && (
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-warning-100 dark:bg-warning-900/30 rounded-full">
                      <ShieldExclamationIcon className="w-8 h-8 text-warning-600 dark:text-warning-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                        Manager Override Required
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Authorization needed for this action
                      </p>
                    </div>
                  </div>

                  {/* Override Details */}
                  <div className="bg-secondary-50 dark:bg-secondary-700/50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{reasonConfig.icon}</span>
                      <div>
                        <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                          {reasonConfig.title}
                        </h4>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {reasonConfig.description}
                        </p>
                      </div>
                    </div>

                    {transactionId && (
                      <div className="text-xs text-secondary-500 dark:text-secondary-500 mb-2">
                        Transaction: {transactionId}
                      </div>
                    )}

                    {amount && reasonConfig.requiresAmount && (
                      <div className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
                        Amount: ${amount.toFixed(2)}
                      </div>
                    )}

                    {description && (
                      <div className="text-sm text-secondary-700 dark:text-secondary-300 mt-2">
                        {description}
                      </div>
                    )}
                  </div>

                  {/* Manager Authentication */}
                  <div className="space-y-4 mb-6">
                    <Input
                      label="Manager ID"
                      type="text"
                      value={managerId}
                      onChange={setManagerId}
                      placeholder="Enter manager ID"
                      icon={<KeyIcon className="w-4 h-4" />}
                    />

                    <div className="relative">
                      <Input
                        label="Manager PIN"
                        type={showPin ? 'text' : 'password'}
                        value={managerPin}
                        onChange={setManagerPin}
                        placeholder="Enter PIN"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                      >
                        {showPin ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={handleCancel}
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleAuthenticate}
                      disabled={!managerId || !managerPin || isLoading}
                      loading={isLoading}
                    >
                      <ShieldExclamationIcon className="w-4 h-4 mr-2" />
                      Authenticate
                    </Button>
                  </div>
                </div>
              )}

              {/* Confirmation Step */}
              {step === 'confirm' && (
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                      <CheckCircleIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                        Confirm Override
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Manager authenticated as {managerId}
                      </p>
                    </div>
                  </div>

                  {/* Override Summary */}
                  <div className="bg-secondary-50 dark:bg-secondary-700/50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">
                      Authorization Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400">Action:</span>
                        <span className="text-secondary-800 dark:text-secondary-200">
                          {reasonConfig.title}
                        </span>
                      </div>
                      {transactionId && (
                        <div className="flex justify-between">
                          <span className="text-secondary-600 dark:text-secondary-400">Transaction:</span>
                          <span className="text-secondary-800 dark:text-secondary-200">
                            {transactionId}
                          </span>
                        </div>
                      )}
                      {amount && (
                        <div className="flex justify-between">
                          <span className="text-secondary-600 dark:text-secondary-400">Amount:</span>
                          <span className="text-secondary-800 dark:text-secondary-200">
                            ${amount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400">Manager:</span>
                        <span className="text-secondary-800 dark:text-secondary-200">
                          {managerId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600 dark:text-secondary-400">Time:</span>
                        <span className="text-secondary-800 dark:text-secondary-200">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                      placeholder="Additional notes for this override..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleAuthorize}
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Authorize
                    </Button>
                  </div>
                </div>
              )}

              {/* Success Step */}
              {step === 'success' && (
                <div className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-success-100 dark:bg-success-900/30 rounded-full inline-block mb-4"
                  >
                    <CheckCircleIcon className="w-12 h-12 text-success-600 dark:text-success-400" />
                  </motion.div>
                  
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                    Override Authorized
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    {reasonConfig.title} approved by manager
                  </p>
                  
                  <div className="text-xs text-secondary-500 dark:text-secondary-500">
                    Authorization logged for audit trail
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};