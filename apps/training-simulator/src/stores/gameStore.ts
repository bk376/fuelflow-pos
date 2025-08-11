import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

export interface GameSession {
  id: string;
  scenarioId: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  maxScore: number;
  timeSpent: number; // in seconds
  mistakes: number;
  hints: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  gamesCompleted: number;
  totalScore: number;
  averageScore: number;
  streak: number; // consecutive days played
  lastPlayedDate?: Date;
  achievements: Achievement[];
  badges: string[];
  completedScenarios: string[];
  favoriteScenarios: string[];
}

interface GameState {
  progress: UserProgress;
  sessions: GameSession[];
  currentSession: GameSession | null;
  isInGame: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  
  // Actions
  startSession: (scenarioId: string, difficulty: 'easy' | 'medium' | 'hard' | 'expert') => void;
  completeSession: (score: number, maxScore: number, mistakes: number, hints: number) => void;
  addXP: (amount: number) => void;
  unlockAchievement: (achievement: Achievement) => void;
  checkForAchievements: (session: GameSession, totalXp: number, gamesCompleted: number) => void;
  updateSettings: (settings: { soundEnabled?: boolean; animationsEnabled?: boolean }) => void;
  resetProgress: () => void;
}

const LEVEL_XP_REQUIREMENTS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250, // Levels 0-10
  3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450, // Levels 11-20
];

const calculateLevel = (totalXp: number): { level: number; xpToNextLevel: number } => {
  let level = 0;
  
  for (let i = 0; i < LEVEL_XP_REQUIREMENTS.length; i++) {
    if (totalXp >= LEVEL_XP_REQUIREMENTS[i]) {
      level = i;
    } else {
      break;
    }
  }
  
  const nextLevelXp = LEVEL_XP_REQUIREMENTS[level + 1] || LEVEL_XP_REQUIREMENTS[LEVEL_XP_REQUIREMENTS.length - 1];
  const xpToNextLevel = nextLevelXp - totalXp;
  
  return { level, xpToNextLevel };
};

const initialProgress: UserProgress = {
  level: 0,
  xp: 0,
  xpToNextLevel: 100,
  totalXp: 0,
  gamesCompleted: 0,
  totalScore: 0,
  averageScore: 0,
  streak: 0,
  achievements: [],
  badges: [],
  completedScenarios: [],
  favoriteScenarios: [],
};

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      progress: initialProgress,
      sessions: [],
      currentSession: null,
      isInGame: false,
      soundEnabled: true,
      animationsEnabled: true,

      startSession: (scenarioId, difficulty) => {
        const session: GameSession = {
          id: `session-${Date.now()}`,
          scenarioId,
          startedAt: new Date(),
          score: 0,
          maxScore: 100,
          timeSpent: 0,
          mistakes: 0,
          hints: 0,
          difficulty,
        };

        set({
          currentSession: session,
          isInGame: true,
        });
      },

      completeSession: (score, maxScore, mistakes, hints) => {
        const { currentSession, sessions, progress } = get();
        
        if (!currentSession) return;

        const completedSession: GameSession = {
          ...currentSession,
          completedAt: new Date(),
          score,
          maxScore,
          mistakes,
          hints,
          timeSpent: Math.floor((Date.now() - currentSession.startedAt.getTime()) / 1000),
        };

        const newSessions = [...sessions, completedSession];
        const newGamesCompleted = progress.gamesCompleted + 1;
        const newTotalScore = progress.totalScore + score;
        const newAverageScore = newTotalScore / newGamesCompleted;

        // Calculate XP based on performance
        let xpGained = Math.floor(score / maxScore * 50); // Base XP
        
        // Bonus XP for perfect score
        if (score === maxScore) {
          xpGained += 25;
        }
        
        // Bonus XP for no mistakes
        if (mistakes === 0) {
          xpGained += 15;
        }
        
        // Bonus XP for no hints
        if (hints === 0) {
          xpGained += 10;
        }

        // Difficulty multiplier
        const difficultyMultiplier = {
          easy: 1,
          medium: 1.25,
          hard: 1.5,
          expert: 2
        }[completedSession.difficulty];
        
        xpGained = Math.floor(xpGained * difficultyMultiplier);

        const newTotalXp = progress.totalXp + xpGained;
        const { level, xpToNextLevel } = calculateLevel(newTotalXp);

        // Update completed scenarios
        const completedScenarios = [...new Set([...progress.completedScenarios, currentSession.scenarioId])];

        set({
          sessions: newSessions,
          currentSession: null,
          isInGame: false,
          progress: {
            ...progress,
            level,
            xp: xpGained,
            xpToNextLevel,
            totalXp: newTotalXp,
            gamesCompleted: newGamesCompleted,
            totalScore: newTotalScore,
            averageScore: newAverageScore,
            lastPlayedDate: new Date(),
            completedScenarios,
          },
        });

      },

      addXP: (amount) => {
        const { progress } = get();
        const newTotalXp = progress.totalXp + amount;
        const { level, xpToNextLevel } = calculateLevel(newTotalXp);

        set({
          progress: {
            ...progress,
            xp: amount,
            totalXp: newTotalXp,
            level,
            xpToNextLevel,
          },
        });
      },

      unlockAchievement: (achievement) => {
        const { progress } = get();
        
        if (progress.achievements.find(a => a.id === achievement.id)) {
          return; // Already unlocked
        }

        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date(),
        };

        set({
          progress: {
            ...progress,
            achievements: [...progress.achievements, unlockedAchievement],
          },
        });

        // Add XP reward
        get().addXP(achievement.xpReward);
      },

      checkForAchievements: (session: GameSession, totalXp: number, gamesCompleted: number) => {
        const achievements: Achievement[] = [];

        // First game achievement
        if (gamesCompleted === 1) {
          achievements.push({
            id: 'first-steps',
            name: 'First Steps',
            description: 'Complete your first training scenario',
            icon: '🎯',
            rarity: 'common',
            xpReward: 50,
          });
        }

        // Perfect score achievement
        if (session.score === session.maxScore && session.mistakes === 0) {
          achievements.push({
            id: 'perfectionist',
            name: 'Perfectionist',
            description: 'Complete a scenario with perfect score and no mistakes',
            icon: '🌟',
            rarity: 'rare',
            xpReward: 100,
          });
        }

        // Speed demon achievement
        if (session.timeSpent < 60) {
          achievements.push({
            id: 'speed-demon',
            name: 'Speed Demon',
            description: 'Complete a scenario in under 60 seconds',
            icon: '⚡',
            rarity: 'rare',
            xpReward: 75,
          });
        }

        // Level milestones
        const currentLevel = calculateLevel(totalXp).level;
        if ([5, 10, 15, 20].includes(currentLevel)) {
          achievements.push({
            id: `level-${currentLevel}`,
            name: `Level ${currentLevel} Master`,
            description: `Reach level ${currentLevel}`,
            icon: '🏆',
            rarity: currentLevel >= 15 ? 'epic' : 'rare',
            xpReward: currentLevel * 25,
          });
        }

        // Unlock achievements
        achievements.forEach(achievement => {
          get().unlockAchievement(achievement);
        });
      },

      updateSettings: (settings) => {
        set((state) => ({
          ...state,
          ...settings,
        }));
      },

      resetProgress: () => {
        set({
          progress: initialProgress,
          sessions: [],
          currentSession: null,
          isInGame: false,
        });
      },
    }),
    {
      name: 'training-game-storage',
      partialize: (state) => ({
        progress: state.progress,
        sessions: state.sessions,
        soundEnabled: state.soundEnabled,
        animationsEnabled: state.animationsEnabled,
      }),
    }
  )
);


export default useGameStore;