import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Training Simulator Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-600 to-purple-500 flex items-center justify-center p-4">
          <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md">
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-2xl font-bold text-white mb-4">Training Simulator Error</h1>
            <p className="text-white/80 mb-6">
              Something went wrong while running the training simulator.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                Restart Simulator
              </button>
              {this.state.error && (
                <details className="text-left">
                  <summary className="text-white/60 cursor-pointer hover:text-white">
                    Technical Details
                  </summary>
                  <pre className="text-xs text-white/40 mt-2 p-2 bg-black/20 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;