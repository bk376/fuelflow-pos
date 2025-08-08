import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('POS Terminal Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-danger-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-danger-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">
              System Error
            </h1>
            
            <p className="text-secondary-600 mb-6">
              The POS terminal has encountered an unexpected error. Please restart the application or contact technical support.
            </p>
            
            <div className="space-y-3">
              <button
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Restart Application
              </button>
              
              <details className="text-left">
                <summary className="text-sm text-secondary-500 cursor-pointer hover:text-secondary-700">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs text-secondary-700 bg-secondary-100 p-3 rounded-lg overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;