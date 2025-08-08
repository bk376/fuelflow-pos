import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Stores
import useAuthStore from './stores/authStore';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import POSLayout from './layouts/POSLayout';

// Pages
import LoginPage from './pages/LoginPage';
import POSTerminal from './pages/POSTerminal';
import FuelManager from './pages/FuelManager';
import TransactionHistory from './pages/TransactionHistory';
import Settings from './pages/Settings';

// Components
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { isAuthenticated, isLoading, user, refreshToken } = useAuthStore();

  useEffect(() => {
    // Auto-refresh token on app start if user is logged in
    if (isAuthenticated && user) {
      refreshToken().catch(() => {
        // Token refresh failed, user will be logged out automatically
      });
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="pos-mode h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            {!isAuthenticated ? (
              <Routes key="auth">
                <Route path="/login" element={
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                } />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            ) : (
              <Routes key="pos">
                <Route path="/" element={
                  <POSLayout>
                    <POSTerminal />
                  </POSLayout>
                } />
                <Route path="/fuel" element={
                  <POSLayout>
                    <FuelManager />
                  </POSLayout>
                } />
                <Route path="/transactions" element={
                  <POSLayout>
                    <TransactionHistory />
                  </POSLayout>
                } />
                <Route path="/settings" element={
                  <POSLayout>
                    <Settings />
                  </POSLayout>
                } />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </AnimatePresence>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;