import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useGameStore from '../stores/gameStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { progress, sessions } = useGameStore();

  const recentSessions = sessions.slice(-3).reverse();
  const todaySessions = sessions.filter(s => {
    const today = new Date();
    const sessionDate = new Date(s.startedAt);
    return sessionDate.toDateString() === today.toDateString();
  });

  const trainingScenarios = [
    {
      id: 'pos-basics',
      title: 'POS System Mastery',
      description: 'Master the fundamentals of point-of-sale operations with interactive scenarios',
      difficulty: 'Beginner',
      icon: '💳',
      path: '/games/pos-basics',
      color: 'from-emerald-400 via-cyan-500 to-blue-500',
      completedColor: 'from-emerald-300 to-teal-400',
      estimatedTime: '15 min',
      xpReward: 50
    },
    {
      id: 'fuel-safety',
      title: 'Fuel Safety Protocols',
      description: 'Learn critical safety procedures for fuel handling and emergency response',
      difficulty: 'Intermediate',
      icon: '⛽',
      path: '/games/fuel-safety',
      color: 'from-amber-400 via-orange-500 to-red-500',
      completedColor: 'from-amber-300 to-orange-400',
      estimatedTime: '20 min',
      xpReward: 75
    },
    {
      id: 'customer-service',
      title: 'Customer Excellence',
      description: 'Develop exceptional customer interaction and service recovery skills',
      difficulty: 'Intermediate',
      icon: '🤝',
      path: '/games/customer-service',
      color: 'from-purple-400 via-pink-500 to-rose-500',
      completedColor: 'from-purple-300 to-pink-400',
      estimatedTime: '18 min',
      xpReward: 75
    },
    {
      id: 'emergency-procedures',
      title: 'Emergency Response',
      description: 'Master critical emergency procedures and incident management protocols',
      difficulty: 'Advanced',
      icon: '🚨',
      path: '/games/emergency-procedures',
      color: 'from-red-400 via-rose-500 to-purple-600',
      completedColor: 'from-red-300 to-rose-400',
      estimatedTime: '25 min',
      xpReward: 100
    }
  ];

  const getNextLevelXP = () => {
    return progress.xp + progress.xpToNextLevel;
  };

  const getLevelProgress = () => {
    const totalNeededForNext = getNextLevelXP();
    const currentLevelBase = totalNeededForNext - progress.xpToNextLevel - progress.xp;
    const progressInLevel = progress.xp;
    const levelXPRange = totalNeededForNext - currentLevelBase;
    return (progressInLevel / levelXPRange) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-8 space-y-8">
        {/* Hero Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl"></div>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="mb-6 lg:mb-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex items-center mb-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-white mb-1">
                      Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{user?.firstName}</span>!
                    </h1>
                    <p className="text-white/70 text-lg">Ready to level up your skills today?</p>
                  </div>
                </motion.div>
                
                {/* Stats Pills */}
                <div className="flex flex-wrap gap-3">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-sm">🏆</span>
                    </div>
                    <div>
                      <div className="text-white font-bold">Level {progress.level}</div>
                      <div className="text-purple-200 text-xs">Current Level</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center space-x-3 bg-gradient-to-r from-pink-500/20 to-pink-600/20 backdrop-blur-sm border border-pink-400/30 rounded-full px-4 py-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-sm">⭐</span>
                    </div>
                    <div>
                      <div className="text-white font-bold">{progress.totalXp}</div>
                      <div className="text-pink-200 text-xs">Total XP</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm">🔥</span>
                    </div>
                    <div>
                      <div className="text-white font-bold">{progress.streak}</div>
                      <div className="text-blue-200 text-xs">Day Streak</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Level Progress Circle */}
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                className="relative"
              >
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-white/10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="transparent"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - getLevelProgress() / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Lv.{progress.level}</div>
                    <div className="text-xs text-white/60">{progress.xpToNextLevel} XP</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Training Scenarios - Main Content */}
          <div className="xl:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">Training Scenarios</h2>
              <p className="text-white/70 mb-6">Choose your next challenge and master new skills</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trainingScenarios.map((scenario, index) => {
                const isCompleted = progress.completedScenarios.includes(scenario.id);
                
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.3 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative overflow-hidden"
                  >
                    {/* Card Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-20 rounded-2xl transition-opacity group-hover:opacity-30`}></div>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 group-hover:border-white/30 transition-all"></div>
                    
                    {/* Completion Badge */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                    )}
                    
                    <Link to={scenario.path} className="relative block p-6 h-full">
                      <div className="flex items-start space-x-4 mb-4">
                        <motion.div 
                          whileHover={{ rotate: 12, scale: 1.1 }}
                          className={`w-16 h-16 bg-gradient-to-br ${scenario.color} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-3xl">{scenario.icon}</span>
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                            {scenario.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              scenario.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                              scenario.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                              'bg-red-500/20 text-red-300 border border-red-400/30'
                            }`}>
                              {scenario.difficulty}
                            </span>
                            <span className="text-white/60">⏱️ {scenario.estimatedTime}</span>
                            <span className="text-white/60">+{scenario.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm mb-4 leading-relaxed">
                        {scenario.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-white/60">
                          {isCompleted && (
                            <span className="text-green-400 text-sm">Completed ✨</span>
                          )}
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center space-x-2 text-purple-300 group-hover:text-white transition-colors"
                        >
                          <span className="font-medium">{isCompleted ? 'Play Again' : 'Start Training'}</span>
                          <span>→</span>
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar - Stats & Activities */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Today's Progress */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl"></div>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"></div>
              <div className="relative p-6">
                <h3 className="text-lg font-bold text-white mb-4">Today's Progress</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-400">
                    {todaySessions.length}/3
                  </div>
                  <div className="text-white/60 text-sm">Sessions Completed</div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mb-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (todaySessions.length / 3) * 100)}%` }}
                    transition={{ delay: 1, duration: 1 }}
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                  />
                </div>
                <p className="text-white/70 text-sm text-center">
                  {todaySessions.length >= 3 ? "🎉 Daily goal achieved!" : `${3 - todaySessions.length} more session${3 - todaySessions.length !== 1 ? 's' : ''} to go!`}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"></div>
              <div className="relative p-6">
                <h3 className="text-lg font-bold text-white mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🏆</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Achievements</div>
                        <div className="text-white/60 text-xs">Badges earned</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-white">{progress.achievements.length}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🎯</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Completed</div>
                        <div className="text-white/60 text-xs">Training scenarios</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-white">{progress.completedScenarios.length}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📊</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Avg Score</div>
                        <div className="text-white/60 text-xs">Performance rating</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-white">{Math.round(progress.averageScore)}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"></div>
              <div className="relative p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                {recentSessions.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="text-white/60 text-sm">Start your first training session!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentSessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                          <span className="text-xs">🎮</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm capitalize">
                            {session.scenarioId.replace('-', ' ')}
                          </div>
                          <div className="text-white/60 text-xs">
                            {new Date(session.startedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-sm">
                            {Math.round((session.score / session.maxScore) * 100)}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;