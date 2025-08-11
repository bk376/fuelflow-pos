import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import useAuthStore from '../stores/authStore';

// Mock leaderboard data - in production this would come from API
const mockLeaderboardData = [
  {
    id: 'user-001',
    name: 'Sarah Chen',
    level: 18,
    totalXP: 8750,
    averageScore: 94,
    gamesCompleted: 47,
    streak: 12,
    achievements: 23,
    badge: '👑',
    title: 'Training Champion'
  },
  {
    id: 'user-002', 
    name: 'Mike Rodriguez',
    level: 16,
    totalXP: 7200,
    averageScore: 89,
    gamesCompleted: 52,
    streak: 8,
    achievements: 19,
    badge: '🥈',
    title: 'Safety Expert'
  },
  {
    id: 'user-003',
    name: 'Emma Johnson',
    level: 15,
    totalXP: 6890,
    averageScore: 92,
    gamesCompleted: 39,
    streak: 15,
    achievements: 21,
    badge: '🥉',
    title: 'Customer Service Pro'
  },
  {
    id: 'user-004',
    name: 'David Kim',
    level: 14,
    totalXP: 6300,
    averageScore: 87,
    gamesCompleted: 44,
    streak: 6,
    achievements: 18,
    badge: '🏆',
    title: 'POS Master'
  },
  {
    id: 'user-005',
    name: 'Lisa Parker',
    level: 13,
    totalXP: 5950,
    averageScore: 91,
    gamesCompleted: 35,
    streak: 9,
    achievements: 16,
    badge: '⭐',
    title: 'Rising Star'
  }
];

const Leaderboard: React.FC = () => {
  const { user } = useAuthStore();
  const { progress } = useGameStore();
  const [sortBy, setSortBy] = useState<'totalXP' | 'averageScore' | 'level' | 'gamesCompleted'>('totalXP');
  const [timeframe, setTimeframe] = useState<'all-time' | 'monthly' | 'weekly'>('all-time');

  // Add current user to leaderboard
  const currentUserData = {
    id: user?.id || 'current',
    name: `${user?.firstName} ${user?.lastName}` || 'You',
    level: progress.level,
    totalXP: progress.totalXp,
    averageScore: progress.averageScore,
    gamesCompleted: progress.gamesCompleted,
    streak: progress.streak,
    achievements: progress.achievements.length,
    badge: progress.level >= 15 ? '👑' : progress.level >= 10 ? '🥈' : progress.level >= 5 ? '🥉' : '🏆',
    title: progress.level >= 15 ? 'Training Expert' : progress.level >= 10 ? 'Skilled Trainee' : progress.level >= 5 ? 'Learning Fast' : 'Getting Started'
  };

  const allUsers = [...mockLeaderboardData, currentUserData]
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const currentUserRank = allUsers.findIndex(u => u.id === currentUserData.id) + 1;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-white/80';
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Training Leaderboard</h1>
          <p className="text-white/80">See how you rank against other trainees</p>
        </motion.div>

        {/* Your Rank Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30"
        >
          <h2 className="text-xl font-bold text-white mb-4">Your Current Ranking</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold">{currentUserData.name}</h3>
                <p className="text-purple-300 text-sm">{currentUserData.title}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                {getRankIcon(currentUserRank)}
              </div>
              <div className="text-white/60 text-sm">Rank {currentUserRank} of {allUsers.length}</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <label className="text-white/80 text-sm font-medium mr-3">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="totalXP" className="bg-slate-800">Total XP</option>
                <option value="level" className="bg-slate-800">Level</option>
                <option value="averageScore" className="bg-slate-800">Average Score</option>
                <option value="gamesCompleted" className="bg-slate-800">Games Completed</option>
              </select>
            </div>
            
            <div>
              <label className="text-white/80 text-sm font-medium mr-3">Timeframe:</label>
              <div className="inline-flex rounded-lg bg-white/20 p-1">
                {['all-time', 'monthly', 'weekly'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period as typeof timeframe)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                      timeframe === period
                        ? 'bg-purple-500 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
        >
          <div className="space-y-1">
            {allUsers.map((userData, index) => {
              const rank = index + 1;
              const isCurrentUser = userData.id === currentUserData.id;
              
              return (
                <motion.div
                  key={userData.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 border-b border-white/10 last:border-b-0 transition-all ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-l-purple-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Rank and User Info */}
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl font-bold ${getRankColor(rank)} min-w-[3rem] text-center`}>
                        {getRankIcon(rank)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {userData.name.split(' ').map(n => n.charAt(0)).join('')}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className={`font-bold ${
                            isCurrentUser ? 'text-purple-200' : 'text-white'
                          }`}>
                            {userData.name} {isCurrentUser && '(You)'}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-white/60">{userData.title}</span>
                            <span className="text-lg">{userData.badge}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-white">{userData.level}</div>
                        <div className="text-white/60">Level</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-bold text-white">{userData.totalXP.toLocaleString()}</div>
                        <div className="text-white/60">XP</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-bold text-white">{userData.averageScore}%</div>
                        <div className="text-white/60">Avg Score</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-bold text-white">{userData.gamesCompleted}</div>
                        <div className="text-white/60">Games</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-bold text-white">{userData.streak}</div>
                        <div className="text-white/60">Streak</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-bold text-white">{userData.achievements}</div>
                        <div className="text-white/60">Badges</div>
                      </div>
                    </div>
                    
                    {/* Mobile Stats */}
                    <div className="md:hidden flex flex-col items-end text-sm space-y-1">
                      <div className="font-bold text-white">Lv.{userData.level}</div>
                      <div className="text-white/60">{userData.totalXP.toLocaleString()} XP</div>
                      <div className="text-white/60">{userData.averageScore}% avg</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Leaderboard Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/60 text-sm"
        >
          <p>Rankings are updated in real-time as you complete training scenarios.</p>
          <p className="mt-1">Keep training to improve your position!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;