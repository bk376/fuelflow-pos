import { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@gas-station/ui-components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_: Error): State {
    return {
      hasError: true,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service in production
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-6 text-center">
            {/* Error Icon */}
            <div className="p-4 bg-danger-100 dark:bg-danger-900/30 rounded-full inline-block mb-6">
              <ExclamationTriangleIcon className="w-12 h-12 text-danger-600 dark:text-danger-400" />
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              Something went wrong
            </h1>

            {/* Error Description */}
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              The manager dashboard encountered an unexpected error. 
              Our team has been notified and is working to fix this issue.
            </p>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2 text-sm">
                  Error Details:
                </h3>
                <pre className="text-xs text-danger-600 dark:text-danger-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            </div>

            {/* Support Info */}
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-4">
              If this problem persists, please contact technical support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;