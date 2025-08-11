import React from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../stores/gameStore';

const Achievements: React.FC = () => {
  const { progress } = useGameStore();

  // All possible achievements in the system
  const allAchievements = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first training scenario',
      icon: '🎯',
      rarity: 'common' as const,
      xpReward: 50,
      category: 'Getting Started'
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Complete a scenario with perfect score and no mistakes',
      icon: '🌟',
      rarity: 'rare' as const,
      xpReward: 100,
      category: 'Performance'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Complete a scenario in under 60 seconds',
      icon: '⚡',
      rarity: 'rare' as const,
      xpReward: 75,
      category: 'Performance'
    },
    {
      id: 'level-5',
      name: 'Level 5 Master',
      description: 'Reach level 5',
      icon: '🏆',
      rarity: 'rare' as const,
      xpReward: 125,
      category: 'Progression'
    },
    {
      id: 'level-10',
      name: 'Level 10 Master',
      description: 'Reach level 10',
      icon: '🏆',
      rarity: 'epic' as const,
      xpReward: 250,
      category: 'Progression'
    },
    {
      id: 'level-15',
      name: 'Level 15 Master',
      description: 'Reach level 15',
      icon: '🏆',
      rarity: 'epic' as const,
      xpReward: 375,
      category: 'Progression'
    },
    {
      id: 'level-20',
      name: 'Level 20 Master',
      description: 'Reach level 20',
      icon: '🏆',
      rarity: 'legendary' as const,
      xpReward: 500,
      category: 'Progression'
    },
    {
      id: 'pos-master',
      name: 'POS Master',
      description: 'Complete all POS training scenarios',
      icon: '💻',
      rarity: 'epic' as const,
      xpReward: 200,
      category: 'Mastery'
    },
    {
      id: 'safety-expert',
      name: 'Safety Expert',
      description: 'Master all fuel safety procedures',
      icon: '🛡️',
      rarity: 'epic' as const,
      xpReward: 200,
      category: 'Mastery'
    },
    {
      id: 'service-champion',
      name: 'Service Champion',
      description: 'Excel in customer service scenarios',
      icon: '👑',
      rarity: 'epic' as const,
      xpReward: 200,
      category: 'Mastery'
    },
    {
      id: 'emergency-hero',
      name: 'Emergency Hero',
      description: 'Master emergency response procedures',
      icon: '🚨',
      rarity: 'legendary' as const,
      xpReward: 300,
      category: 'Mastery'
    },
    {
      id: 'training-complete',
      name: 'Training Graduate',
      description: 'Complete all training scenarios',
      icon: '🎓',
      rarity: 'legendary' as const,
      xpReward: 500,
      category: 'Completion'
    }
  ];

  const categories = ['Getting Started', 'Performance', 'Progression', 'Mastery', 'Completion'];

  const getAchievementStatus = (achievement: typeof allAchievements[0]) => {
    const unlocked = progress.achievements.find(a => a.id === achievement.id);
    return unlocked ? 'unlocked' : 'locked';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-purple-500 to-pink-500';
      case 'epic':
        return 'from-orange-500 to-red-500';
      case 'rare':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-green-500 to-teal-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'border-purple-400';
      case 'epic':
        return 'border-orange-400';
      case 'rare':
        return 'border-blue-400';
      default:
        return 'border-green-400';
    }
  };

  const unlockedCount = progress.achievements.length;
  const totalCount = allAchievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Achievements Gallery</h1>
          <p className="text-white/80 text-lg">Unlock achievements by mastering training scenarios and reaching milestones</p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Achievement Progress</h2>
              <p className="text-white/80">
                You've unlocked <span className="font-bold text-purple-300">{unlockedCount}</span> out of{' '}
                <span className="font-bold text-purple-300">{totalCount}</span> achievements
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-center">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                {completionPercentage}%
              </div>
              <div className="text-white/60 text-sm">Complete</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Achievements by Category */}
        {categories.map((category, categoryIndex) => {
          const categoryAchievements = allAchievements.filter(a => a.category === category);
          const categoryUnlocked = categoryAchievements.filter(a => getAchievementStatus(a) === 'unlocked').length;
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + categoryIndex * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{category}</h2>
                <div className="text-white/60">
                  {categoryUnlocked}/{categoryAchievements.length}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAchievements.map((achievement, index) => {
                  const status = getAchievementStatus(achievement);
                  const isUnlocked = status === 'unlocked';
                  const unlockedAchievement = progress.achievements.find(a => a.id === achievement.id);

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                        isUnlocked
                          ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}/20 ${getRarityBorder(achievement.rarity)} hover:scale-105`
                          : 'bg-white/5 border-gray-600 opacity-60'
                      }`}
                    >
                      {/* Rarity glow effect for unlocked achievements */}
                      {isUnlocked && (
                        <div 
                          className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(achievement.rarity)} opacity-20 rounded-xl blur-xl -z-10`}
                        />
                      )}
                      
                      {/* Icon */}
                      <div className={`text-center mb-3`}>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
                          isUnlocked 
                            ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                            : 'bg-gray-600'
                        }`}>
                          <span className="text-2xl">{isUnlocked ? achievement.icon : '🔒'}</span>
                        </div>
                        
                        {/* Rarity badge */}
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          isUnlocked
                            ? achievement.rarity === 'legendary' ? 'bg-purple-500/30 text-purple-200' :
                              achievement.rarity === 'epic' ? 'bg-orange-500/30 text-orange-200' :
                              achievement.rarity === 'rare' ? 'bg-blue-500/30 text-blue-200' :
                              'bg-green-500/30 text-green-200'
                            : 'bg-gray-600/30 text-gray-300'
                        }`}>
                          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className={`font-bold mb-2 ${
                          isUnlocked ? 'text-white' : 'text-gray-400'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm mb-3 ${
                          isUnlocked ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>

                        {/* Rewards */}
                        <div className={`text-xs ${
                          isUnlocked ? 'text-white/60' : 'text-gray-500'
                        }`}>
                          <span className="font-medium">+{achievement.xpReward} XP</span>
                          {unlockedAchievement?.unlockedAt && (
                            <div className="mt-1">
                              Unlocked: {unlockedAchievement.unlockedAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {/* Locked message */}
                        {!isUnlocked && (
                          <div className="mt-2 text-xs text-gray-400">
                            Complete training scenarios to unlock
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;