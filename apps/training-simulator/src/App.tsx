import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Stores
import useAuthStore from './stores/authStore';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import GameLayout from './layouts/GameLayout';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Scenarios from './pages/Scenarios';
import Leaderboard from './pages/Leaderboard';
import Progress from './pages/Progress';
import Achievements from './pages/Achievements';

// Games
import POSBasicsGame from './games/POSBasicsGame';
import FuelSafetyGame from './games/FuelSafetyGame';
import CustomerServiceGame from './games/CustomerServiceGame';
import EmergencyProceduresGame from './games/EmergencyProceduresGame';

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
        <div className="training-mode min-h-screen">
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
              <Routes key="training">
                <Route path="/" element={
                  <GameLayout>
                    <Dashboard />
                  </GameLayout>
                } />
                <Route path="/scenarios" element={
                  <GameLayout>
                    <Scenarios />
                  </GameLayout>
                } />
                <Route path="/leaderboard" element={
                  <GameLayout>
                    <Leaderboard />
                  </GameLayout>
                } />
                <Route path="/progress" element={
                  <GameLayout>
                    <Progress />
                  </GameLayout>
                } />
                <Route path="/achievements" element={
                  <GameLayout>
                    <Achievements />
                  </GameLayout>
                } />
                
                {/* Training Games */}
                <Route path="/games/pos-basics" element={<POSBasicsGame />} />
                <Route path="/games/fuel-safety" element={<FuelSafetyGame />} />
                <Route path="/games/customer-service" element={<CustomerServiceGame />} />
                <Route path="/games/emergency-procedures" element={<EmergencyProceduresGame />} />
                
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