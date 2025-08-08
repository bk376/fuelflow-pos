import React, { useState } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Payment } from '@gas-station/types';
import Card from './Card';
import Button from './Button';

interface PaymentTerminalProps {
  totalAmount: number;
  isProcessing?: boolean;
  paymentMethods?: Array<{
    type: 'cash' | 'credit' | 'debit' | 'mobile';
    label: string;
    icon: React.ReactNode;
    enabled: boolean;
  }>;
  onPaymentMethodSelect?: (method: string) => void;
  onPaymentComplete?: (payment: Payment) => void;
  onCancel?: () => void;
  className?: string;
}

const PaymentTerminal: React.FC<PaymentTerminalProps> = ({
  totalAmount,
  isProcessing = false,
  paymentMethods = [
    {
      type: 'credit',
      label: 'Credit Card',
      icon: <CreditCardIcon className="w-6 h-6" />,
      enabled: true,
    },
    {
      type: 'debit',
      label: 'Debit Card',
      icon: <CreditCardIcon className="w-6 h-6" />,
      enabled: true,
    },
    {
      type: 'cash',
      label: 'Cash',
      icon: <BanknotesIcon className="w-6 h-6" />,
      enabled: true,
    },
    {
      type: 'mobile',
      label: 'Mobile Pay',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      enabled: true,
    },
  ],
  onPaymentMethodSelect,
  onPaymentComplete,
  onCancel,
  className,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [cashAmount, setCashAmount] = useState<string>('');

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    if (onPaymentMethodSelect) {
      onPaymentMethodSelect(method);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedMethod) return;

    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        setPaymentStatus('success');
        if (onPaymentComplete) {
          // Mock payment object
          const payment: Payment = {
            id: `payment-${Date.now()}`,
            transactionId: 'temp-transaction',
            paymentMethod: selectedMethod as any,
            amount: totalAmount,
            currency: 'USD',
            status: 'approved',
            processedAt: new Date(),
            metadata: {},
          };
          onPaymentComplete(payment);
        }
      } else {
        setPaymentStatus('error');
      }
    }, 2000);
  };

  const handleReset = () => {
    setSelectedMethod(null);
    setPaymentStatus('idle');
    setCashAmount('');
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <ClockIcon className="w-12 h-12 text-warning-500 animate-spin" />;
      case 'success':
        return <CheckCircleIcon className="w-12 h-12 text-success-500" />;
      case 'error':
        return <XCircleIcon className="w-12 h-12 text-danger-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing payment...';
      case 'success':
        return 'Payment successful!';
      case 'error':
        return 'Payment failed. Please try again.';
      default:
        return '';
    }
  };

  return (
    <Card className={clsx('max-w-md mx-auto', className)} padding="lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Payment
        </h2>
        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
          ${totalAmount.toFixed(2)}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {paymentStatus === 'idle' ? (
          <motion.div
            key="payment-methods"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
              Select Payment Method
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <Button
                  key={method.type}
                  variant={selectedMethod === method.type ? 'primary' : 'secondary'}
                  size="lg"
                  disabled={!method.enabled}
                  onClick={() => handleMethodSelect(method.type)}
                  className="flex-col h-20 gap-2"
                >
                  {method.icon}
                  <span className="text-sm">{method.label}</span>
                </Button>
              ))}
            </div>

            {selectedMethod === 'cash' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-3"
              >
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Cash Amount Received
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={totalAmount}
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="input-base input-lg w-full text-center text-xl font-bold"
                  placeholder="0.00"
                />
                {parseFloat(cashAmount) > totalAmount && (
                  <div className="text-center p-3 bg-success-50 dark:bg-success-900/20 rounded-xl">
                    <div className="text-sm text-success-700 dark:text-success-300">
                      Change Due
                    </div>
                    <div className="text-xl font-bold text-success-800 dark:text-success-200">
                      ${(parseFloat(cashAmount) - totalAmount).toFixed(2)}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={
                  !selectedMethod ||
                  (selectedMethod === 'cash' && parseFloat(cashAmount) < totalAmount)
                }
                onClick={handleProcessPayment}
              >
                Process Payment
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="payment-status"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                {getStatusMessage()}
              </h3>
              
              {paymentStatus === 'processing' && (
                <p className="text-secondary-600 dark:text-secondary-400">
                  Please wait while we process your payment...
                </p>
              )}
              
              {paymentStatus === 'success' && (
                <div className="space-y-2">
                  <p className="text-success-600 dark:text-success-400">
                    Your payment has been processed successfully.
                  </p>
                  {selectedMethod === 'cash' && parseFloat(cashAmount) > totalAmount && (
                    <div className="bg-success-50 dark:bg-success-900/20 rounded-xl p-4">
                      <div className="text-sm text-success-700 dark:text-success-300 mb-1">
                        Change Due
                      </div>
                      <div className="text-2xl font-bold text-success-800 dark:text-success-200">
                        ${(parseFloat(cashAmount) - totalAmount).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {paymentStatus === 'error' && (
                <p className="text-danger-600 dark:text-danger-400">
                  There was an error processing your payment. Please try again or use a different payment method.
                </p>
              )}
            </div>

            {paymentStatus === 'error' && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleReset}
              >
                Try Again
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default PaymentTerminal;