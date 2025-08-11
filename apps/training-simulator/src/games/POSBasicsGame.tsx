import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../stores/gameStore';

const POSBasicsGame: React.FC = () => {
  const navigate = useNavigate();
  const { startSession, completeSession } = useGameStore();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hints, setHints] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('easy');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const questions = [
    {
      id: 1,
      question: "What is the first step when a customer approaches the counter?",
      options: [
        "Start scanning items immediately",
        "Greet the customer warmly",
        "Ask for their payment method", 
        "Check if they have a loyalty card"
      ],
      correct: 1,
      explanation: "Always greet customers first to create a welcoming experience.",
      hint: "Customer service starts with a warm welcome."
    },
    {
      id: 2,
      question: "How should you handle a barcode that won't scan?",
      options: [
        "Keep trying to scan it multiple times",
        "Skip the item and continue",
        "Manually enter the product code",
        "Ask another employee for help"
      ],
      correct: 2,
      explanation: "When a barcode won't scan, manually enter the product code or look up the item.",
      hint: "Every item has a backup identification method."
    },
    {
      id: 3,
      question: "What payment methods should you accept?",
      options: [
        "Cash only",
        "Cash and credit cards",
        "Cash, credit, debit, and mobile payments",
        "Whatever the customer prefers"
      ],
      correct: 2,
      explanation: "Modern POS systems should accept all common payment methods for customer convenience.",
      hint: "Think about all the ways people pay today."
    },
    {
      id: 4,
      question: "When should you ask for ID for alcohol sales?",
      options: [
        "Only if the customer looks under 21",
        "For everyone who looks under 40",
        "Only if required by law",
        "For every alcohol purchase"
      ],
      correct: 1,
      explanation: "Most stores have a policy to check ID for anyone who appears under 40 when purchasing alcohol.",
      hint: "Better to be safe and consistent with age verification."
    },
    {
      id: 5,
      question: "How do you process a return without a receipt?",
      options: [
        "Refuse the return",
        "Accept it at full price",
        "Look up the transaction in the system",
        "Give store credit at lowest sale price"
      ],
      correct: 3,
      explanation: "Many POS systems can look up transactions by card number or customer information.",
      hint: "Modern systems have ways to find transaction history."
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (timeRemaining === 0 && gameState === 'playing') {
      handleGameEnd();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, gameState]);

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setMistakes(0);
    setHints(0);
    setTimeRemaining(selectedDifficulty === 'expert' ? 180 : selectedDifficulty === 'hard' ? 240 : 300);
    startSession('pos-basics', selectedDifficulty);
  };

  const handleAnswer = (selectedIndex: number) => {
    const question = questions[currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
      setScore(prev => prev + (selectedDifficulty === 'expert' ? 25 : selectedDifficulty === 'hard' ? 20 : selectedDifficulty === 'medium' ? 15 : 10));
      setShowFeedback('correct');
    } else {
      setMistakes(prev => prev + 1);
      setShowFeedback('incorrect');
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        handleGameEnd();
      }
    }, 2000);
  };

  const handleHint = () => {
    setHints(prev => prev + 1);
    // Show hint logic would go here
  };

  const handleGameEnd = () => {
    setGameState('completed');
    const maxScore = questions.length * (selectedDifficulty === 'expert' ? 25 : selectedDifficulty === 'hard' ? 20 : selectedDifficulty === 'medium' ? 15 : 10);
    completeSession(score, maxScore, mistakes, hints);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'expert': return 'from-red-500 to-pink-500';
      case 'hard': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      default: return 'from-green-500 to-blue-500';
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-2">POS System Basics</h1>
            <p className="text-white/80">Master the fundamentals of point-of-sale operations</p>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Select Difficulty:</h3>
            <div className="space-y-2">
              {(['easy', 'medium', 'hard', 'expert'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    selectedDifficulty === difficulty
                      ? `bg-gradient-to-r ${getDifficultyColor(difficulty)} border-white/30 text-white`
                      : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{difficulty}</span>
                    <span className="text-sm">
                      {difficulty === 'expert' ? '3 min' : difficulty === 'hard' ? '4 min' : '5 min'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStartGame}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all"
            >
              Start Training
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const maxScore = questions.length * (selectedDifficulty === 'expert' ? 25 : selectedDifficulty === 'hard' ? 20 : selectedDifficulty === 'medium' ? 15 : 10);
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 text-center"
        >
          <div className="mb-6">
            <div className="text-6xl mb-4">
              {percentage >= 90 ? '🎉' : percentage >= 70 ? '👏' : '💪'}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Good Job!' : 'Keep Learning!'}
            </h1>
            <p className="text-white/80">Training session completed</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{percentage}%</div>
              <div className="text-white/60 text-sm">Score</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-white/60 text-sm">Points</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{mistakes}</div>
              <div className="text-white/60 text-sm">Mistakes</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{hints}</div>
              <div className="text-white/60 text-sm">Hints Used</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStartGame}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing state
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20 p-2 rounded-lg"
            >
              ← Exit
            </button>
            <span className="text-white font-medium">POS Basics Training</span>
          </div>
          
          <div className="flex items-center space-x-6 text-white">
            <div className="text-center">
              <div className="font-bold">{formatTime(timeRemaining)}</div>
              <div className="text-xs text-white/60">Time Left</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{score}</div>
              <div className="text-xs text-white/60">Score</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-white/80 text-sm mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback !== null}
                className="w-full p-4 text-left bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all disabled:cursor-not-allowed"
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleHint}
              className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 rounded-lg transition-all"
            >
              💡 Hint ({hints} used)
            </button>
            
            <div className="text-white/60 text-sm">
              Difficulty: <span className="capitalize">{selectedDifficulty}</span>
            </div>
          </div>
        </motion.div>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-4 p-4 rounded-xl border ${
                showFeedback === 'correct'
                  ? 'bg-green-500/20 border-green-400/30 text-green-200'
                  : 'bg-red-500/20 border-red-400/30 text-red-200'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">
                  {showFeedback === 'correct' ? '✅' : '❌'}
                </span>
                <span className="font-bold">
                  {showFeedback === 'correct' ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm">{question.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default POSBasicsGame;