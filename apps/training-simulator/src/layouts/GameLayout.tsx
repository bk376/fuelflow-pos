import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useGameStore from '../stores/gameStore';

interface GameLayoutProps {
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { progress } = useGameStore();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/scenarios', label: 'Training Scenarios', icon: '🎯' },
    { path: '/progress', label: 'My Progress', icon: '📈' },
    { path: '/achievements', label: 'Achievements', icon: '🏆' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '👥' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar - Always Visible */}
      <aside className="w-72 h-screen bg-white/5 backdrop-blur-2xl border-r border-white/10 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-pink-500/5"></div>
        
        <div className="relative h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-white/10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎮</span>
              </div>
              <span className="text-xl font-black text-white">FuelFlow Training</span>
            </motion.div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-white font-bold text-lg">{user?.firstName} {user?.lastName}</p>
                <p className="text-purple-200 text-sm font-medium">Level {progress.level} Trainee</p>
              </div>
            </div>
            
            {/* XP Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-white/80">
                <span className="font-medium">{progress.totalXp} XP</span>
                <span>{progress.xpToNextLevel} to next level</span>
              </div>
              <div className="relative">
                <div className="w-full bg-white/15 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((progress.totalXp) / (progress.totalXp + progress.xpToNextLevel)) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 h-3 rounded-full shadow-lg"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-50"></div>
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>🏆 {progress.achievements.length} badges</span>
                <span>🔥 {progress.streak} day streak</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`group flex items-center space-x-4 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white hover:border-white/10 border border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg'
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="flex items-center space-x-4 w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-400/30 text-red-200 rounded-xl transition-all duration-200"
            >
              <div className="w-10 h-10 bg-red-500/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">🚪</span>
              </div>
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border-b border-white/10"></div>
          <div className="relative flex items-center justify-between h-20 px-8">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-white">Training Dashboard</h1>
                <p className="text-white/60 text-sm">Master your gas station skills</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">🏆</span>
                  </div>
                  <span className="text-white font-medium text-sm">{progress.achievements.length}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">🔥</span>
                  </div>
                  <span className="text-white font-medium text-sm">{progress.streak}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                  <span className="text-white font-medium text-sm">{progress.totalXp}</span>
                </div>
              </motion.div>

              {/* User Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
              >
                <span className="text-white font-bold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-slate-900/50">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

    </div>
  );
};

export default GameLayout;