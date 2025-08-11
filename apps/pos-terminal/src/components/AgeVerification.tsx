import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { Button } from '@gas-station/ui-components';

interface AgeVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (verification: AgeVerificationResult) => void;
  restrictedItems: string[];
  minimumAge?: number;
}

interface AgeVerificationResult {
  verified: boolean;
  customerAge: number;
  idType: string;
  idNumber: string;
  verificationMethod: 'manual' | 'scanner';
  cashierName: string;
}

export const AgeVerification: React.FC<AgeVerificationProps> = ({
  isOpen,
  onClose,
  onVerified,
  restrictedItems,
  minimumAge = 21
}) => {
  const [step, setStep] = useState<'warning' | 'verify' | 'confirm'>('warning');
  const [customerAge, setCustomerAge] = useState('');
  const [idType, setIdType] = useState('drivers_license');
  const [idNumber, setIdNumber] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'manual' | 'scanner'>('manual');

  const handleContinue = () => {
    setStep('verify');
  };

  const handleCancel = () => {
    onClose();
    setStep('warning');
    setCustomerAge('');
    setIdNumber('');
  };

  const handleVerify = () => {
    const age = parseInt(customerAge);
    
    if (age >= minimumAge && idNumber.length >= 8) {
      const verification: AgeVerificationResult = {
        verified: true,
        customerAge: age,
        idType,
        idNumber,
        verificationMethod,
        cashierName: 'Current Cashier' // This would come from auth store
      };
      
      setStep('confirm');
      setTimeout(() => {
        onVerified(verification);
        handleCancel(); // Reset form
      }, 2000);
    } else {
      alert('Verification failed. Customer does not meet age requirements or invalid ID.');
    }
  };

  const idTypes = [
    { value: 'drivers_license', label: 'Driver\'s License' },
    { value: 'state_id', label: 'State ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'military_id', label: 'Military ID' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={step === 'warning' ? onClose : undefined}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Step */}
              {step === 'warning' && (
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-warning-100 dark:bg-warning-900/30 rounded-full">
                      <ExclamationTriangleIcon className="w-8 h-8 text-warning-600 dark:text-warning-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                        Age Verification Required
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Age restricted items detected
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3">
                      The following items require age verification (minimum age: {minimumAge}):
                    </p>
                    <ul className="space-y-2">
                      {restrictedItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-warning-500 rounded-full" />
                          <span className="text-sm text-secondary-800 dark:text-secondary-200">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={onClose}
                    >
                      Cancel Sale
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleContinue}
                    >
                      Verify Age
                    </Button>
                  </div>
                </div>
              )}

              {/* Verification Step */}
              {step === 'verify' && (
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                      <IdentificationIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                        Check Customer ID
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Verify customer identification
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Verification Method */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Verification Method
                      </label>
                      <div className="flex gap-2">
                        <Button
                          variant={verificationMethod === 'manual' ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setVerificationMethod('manual')}
                          className="flex-1"
                        >
                          Manual Entry
                        </Button>
                        <Button
                          variant={verificationMethod === 'scanner' ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setVerificationMethod('scanner')}
                          className="flex-1"
                        >
                          ID Scanner
                        </Button>
                      </div>
                    </div>

                    {/* ID Type */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        ID Type
                      </label>
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                      >
                        {idTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Customer Age */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Customer Age
                      </label>
                      <input
                        type="number"
                        value={customerAge}
                        onChange={(e) => setCustomerAge(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                        placeholder="Enter customer age"
                        min="1"
                        max="150"
                      />
                    </div>

                    {/* ID Number */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        ID Number (Last 8 digits)
                      </label>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                        className="w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-secondary-100"
                        placeholder="Last 8 digits of ID"
                        maxLength={8}
                      />
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
                      onClick={handleVerify}
                      disabled={!customerAge || !idNumber || parseInt(customerAge) < minimumAge}
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>
              )}

              {/* Confirmation Step */}
              {step === 'confirm' && (
                <div className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-success-100 dark:bg-success-900/30 rounded-full inline-block mb-4"
                  >
                    <CheckCircleIcon className="w-12 h-12 text-success-600 dark:text-success-400" />
                  </motion.div>
                  
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                    Age Verification Successful
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    Customer meets age requirements
                  </p>
                  
                  <div className="text-xs text-secondary-500 dark:text-secondary-500">
                    Verification logged and receipt will be printed
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