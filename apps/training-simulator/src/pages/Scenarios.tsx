import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useGameStore from '../stores/gameStore';

const Scenarios: React.FC = () => {
  const { progress } = useGameStore();

  const scenarios = [
    {
      id: 'pos-basics',
      title: 'POS System Basics',
      description: 'Learn fundamental POS operations including item scanning, payment processing, and transaction management.',
      difficulty: 'Beginner',
      estimatedTime: '15-20 minutes',
      icon: '🎯',
      path: '/games/pos-basics',
      color: 'from-green-400 to-blue-500',
      prerequisites: [],
      learningObjectives: [
        'Navigate the POS interface',
        'Process different payment types',
        'Handle basic transactions',
        'Manage inventory lookups'
      ]
    },
    {
      id: 'fuel-safety',
      title: 'Fuel Safety Procedures',
      description: 'Master critical safety protocols for fuel dispensing, spill response, and hazard management.',
      difficulty: 'Intermediate',
      estimatedTime: '25-30 minutes',
      icon: '⛽',
      path: '/games/fuel-safety',
      color: 'from-yellow-400 to-orange-500',
      prerequisites: ['pos-basics'],
      learningObjectives: [
        'Identify safety hazards',
        'Execute spill response procedures',
        'Operate emergency shut-offs',
        'Communicate safety protocols'
      ]
    },
    {
      id: 'customer-service',
      title: 'Customer Service Excellence',
      description: 'Develop exceptional customer interaction skills, conflict resolution, and service recovery.',
      difficulty: 'Intermediate',
      estimatedTime: '20-25 minutes',
      icon: '👥',
      path: '/games/customer-service',
      color: 'from-purple-400 to-pink-500',
      prerequisites: ['pos-basics'],
      learningObjectives: [
        'Handle difficult customers',
        'Upsell products effectively',
        'Resolve complaints professionally',
        'Build customer loyalty'
      ]
    },
    {
      id: 'emergency-procedures',
      title: 'Emergency Response',
      description: 'Critical emergency procedures including fire response, medical emergencies, and security incidents.',
      difficulty: 'Advanced',
      estimatedTime: '30-35 minutes',
      icon: '🚨',
      path: '/games/emergency-procedures',
      color: 'from-red-400 to-purple-500',
      prerequisites: ['fuel-safety', 'customer-service'],
      learningObjectives: [
        'Execute emergency protocols',
        'Coordinate with first responders',
        'Manage evacuations',
        'Document incidents properly'
      ]
    }
  ];

  const isScenarioUnlocked = (scenario: any) => {
    if (scenario.prerequisites.length === 0) return true;
    return scenario.prerequisites.every((prereq: string) => 
      progress.completedScenarios.includes(prereq)
    );
  };

  const getScenarioStatus = (scenarioId: string) => {
    if (progress.completedScenarios.includes(scenarioId)) {
      return 'completed';
    }
    return isScenarioUnlocked(scenarios.find(s => s.id === scenarioId) || scenarios[0]) ? 'available' : 'locked';
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Training Scenarios</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Master gas station operations through interactive training scenarios.
            Complete scenarios to unlock new challenges and advance your skills.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">
                {progress.completedScenarios.length}
              </div>
              <div className="text-white/60 text-sm">Completed</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">
                {scenarios.filter(s => isScenarioUnlocked(s) && !progress.completedScenarios.includes(s.id)).length}
              </div>
              <div className="text-white/60 text-sm">Available</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">
                {scenarios.filter(s => !isScenarioUnlocked(s)).length}
              </div>
              <div className="text-white/60 text-sm">Locked</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((progress.completedScenarios.length / scenarios.length) * 100)}%
              </div>
              <div className="text-white/60 text-sm">Overall Progress</div>
            </div>
          </div>
        </motion.div>

        {/* Scenarios Grid */}
        <div className="space-y-6">
          {scenarios.map((scenario, index) => {
            const status = getScenarioStatus(scenario.id);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';

            return (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 ${
                  isLocked ? 'opacity-60' : 'hover:bg-white/15'
                } transition-all duration-300`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Icon and Status */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 bg-gradient-to-r ${scenario.color} rounded-xl flex items-center justify-center mb-3 ${
                      isLocked ? 'grayscale' : ''
                    }`}>
                      <span className="text-3xl">{isLocked ? '🔒' : scenario.icon}</span>
                    </div>
                    <div className="text-center">
                      {isCompleted && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-400/30">
                          ✓ Completed
                        </span>
                      )}
                      {status === 'available' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          Available
                        </span>
                      )}
                      {isLocked && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-300 border border-gray-400/30">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3">
                      <h3 className="text-2xl font-bold text-white mb-2 lg:mb-0">
                        {scenario.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          scenario.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                          scenario.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {scenario.difficulty}
                        </span>
                        <span className="text-white/60">⏱️ {scenario.estimatedTime}</span>
                      </div>
                    </div>

                    <p className="text-white/80 mb-4">{scenario.description}</p>

                    {/* Prerequisites */}
                    {scenario.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-white/80 mb-2">Prerequisites:</h4>
                        <div className="flex flex-wrap gap-2">
                          {scenario.prerequisites.map((prereq) => {
                            const prereqScenario = scenarios.find(s => s.id === prereq);
                            const isPrereqCompleted = progress.completedScenarios.includes(prereq);
                            return (
                              <span
                                key={prereq}
                                className={`px-2 py-1 rounded text-xs ${
                                  isPrereqCompleted
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                {isPrereqCompleted ? '✓' : '✗'} {prereqScenario?.title}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Learning Objectives */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white/80 mb-2">Learning Objectives:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {scenario.learningObjectives.map((objective, idx) => (
                          <div key={idx} className="flex items-center text-sm text-white/70">
                            <span className="text-green-400 mr-2">•</span>
                            {objective}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isLocked ? (
                        <button
                          disabled
                          className="px-6 py-3 bg-gray-500/20 text-gray-400 rounded-lg cursor-not-allowed"
                        >
                          Complete Prerequisites First
                        </button>
                      ) : (
                        <Link
                          to={scenario.path}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200"
                        >
                          {isCompleted ? 'Replay Scenario' : 'Start Training'}
                          <span className="ml-2">→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Scenarios;