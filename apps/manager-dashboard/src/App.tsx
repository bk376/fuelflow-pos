import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Stores
import useAuthStore from './stores/authStore';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import Locations from './pages/Locations';
import Employees from './pages/Employees';
import Inventory from './pages/Inventory';
import FuelManagement from './pages/FuelManagement';
import Reports from './pages/Reports';
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
        <div className="dashboard-mode min-h-screen bg-secondary-50 dark:bg-secondary-900">
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
              <Routes key="dashboard">
                <Route path="/" element={
                  <DashboardLayout>
                    <Overview />
                  </DashboardLayout>
                } />
                <Route path="/analytics" element={
                  <DashboardLayout>
                    <Analytics />
                  </DashboardLayout>
                } />
                <Route path="/locations" element={
                  <DashboardLayout>
                    <Locations />
                  </DashboardLayout>
                } />
                <Route path="/employees" element={
                  <DashboardLayout>
                    <Employees />
                  </DashboardLayout>
                } />
                <Route path="/inventory" element={
                  <DashboardLayout>
                    <Inventory />
                  </DashboardLayout>
                } />
                <Route path="/fuel" element={
                  <DashboardLayout>
                    <FuelManagement />
                  </DashboardLayout>
                } />
                <Route path="/reports" element={
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                } />
                <Route path="/settings" element={
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
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