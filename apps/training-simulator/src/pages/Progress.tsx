import React from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../stores/gameStore';
import useAuthStore from '../stores/authStore';

const Progress: React.FC = () => {
  const { user } = useAuthStore();
  const { progress, sessions } = useGameStore();

  const recentSessions = sessions.slice(-10).reverse();
  const weeklyXP = sessions
    .filter(s => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(s.startedAt) > weekAgo;
    })
    .reduce((total, session) => {
      const xpGained = Math.floor(session.score / session.maxScore * 50);
      return total + xpGained;
    }, 0);

  const avgScore = progress.averageScore;
  const totalPlayTime = sessions.reduce((total, s) => total + s.timeSpent, 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
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
          <h1 className="text-4xl font-bold text-white mb-2">
            {user?.firstName}'s Training Progress
          </h1>
          <p className="text-white/80">Track your learning journey and achievements</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {progress.level}
            </div>
            <div className="text-white/60 text-sm mb-3">Current Level</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="xp-bar h-2 rounded-full"
                style={{ width: `${(progress.xp / (progress.xp + progress.xpToNextLevel)) * 100}%` }}
              />
            </div>
            <div className="text-xs text-white/60 mt-1">
              {progress.xpToNextLevel} XP to next level
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {progress.totalXp.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm mb-3">Total Experience</div>
            <div className="text-xs text-green-300">
              +{weeklyXP} XP this week
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {avgScore.toFixed(0)}%
            </div>
            <div className="text-white/60 text-sm mb-3">Average Score</div>
            <div className="text-xs text-purple-300">
              {progress.gamesCompleted} games completed
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {formatTime(totalPlayTime)}
            </div>
            <div className="text-white/60 text-sm mb-3">Total Play Time</div>
            <div className="text-xs text-orange-300">
              {progress.streak} day streak
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold text-white mb-4">Recent Training Sessions</h2>
            
            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📚</span>
                <p className="text-white/60">No training sessions yet.</p>
                <p className="text-white/60 text-sm">Start your first scenario to see your progress here!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentSessions.map((session) => (
                  <div key={session.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white capitalize">
                        {session.scenarioId.replace('-', ' ')}
                      </h3>
                      <span className={`font-bold ${getScoreColor(session.score, session.maxScore)}`}>
                        {Math.round((session.score / session.maxScore) * 100)}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-xs text-white/60">
                      <div>
                        <div className="text-white/40">Time</div>
                        <div>{formatTime(session.timeSpent)}</div>
                      </div>
                      <div>
                        <div className="text-white/40">Mistakes</div>
                        <div className={session.mistakes === 0 ? 'text-green-400' : ''}>
                          {session.mistakes}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/40">Date</div>
                        <div>{new Date(session.startedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        session.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                        session.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        session.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Achievements Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold text-white mb-4">Recent Achievements</h2>
            
            {progress.achievements.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">🏆</span>
                <p className="text-white/60">No achievements yet.</p>
                <p className="text-white/60 text-sm">Complete training scenarios to unlock achievements!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {progress.achievements
                  .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                  .map((achievement) => (
                    <div key={achievement.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          achievement.rarity === 'epic' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                          achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                          'bg-gradient-to-r from-green-500 to-teal-500'
                        }`}>
                          <span className="text-lg">{achievement.icon}</span>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-1">{achievement.name}</h3>
                          <p className="text-white/60 text-sm mb-2">{achievement.description}</p>
                          
                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded text-xs ${
                              achievement.rarity === 'legendary' ? 'bg-purple-500/20 text-purple-300' :
                              achievement.rarity === 'epic' ? 'bg-orange-500/20 text-orange-300' :
                              achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                            </span>
                            
                            <div className="text-xs text-white/60">
                              +{achievement.xpReward} XP • {achievement.unlockedAt?.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Progress;