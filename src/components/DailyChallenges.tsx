import { useState, useEffect } from 'react';
import { SimulationState } from '../types';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  category: 'bladder' | 'social' | 'vitals' | 'economy';
}

interface DailyChallengesProps {
  state: SimulationState;
}

export default function DailyChallenges({ state }: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [lastGeneratedDay, setLastGeneratedDay] = useState(0);

  // Generate daily challenges
  const generateDailyChallenges = () => {
    if (state.dayNumber === lastGeneratedDay) return;

    const newChallenges: DailyChallenge[] = [
      // Bladder challenges
      {
        id: 'hold_1000',
        title: 'Endurance Master',
        description: 'Reach 1000ml bladder volume',
        icon: '💧',
        target: 1000,
        current: state.bladderVolume,
        reward: 15,
        completed: state.bladderVolume >= 1000,
        category: 'bladder',
      },
      {
        id: 'train_5',
        title: 'Training Regimen',
        description: 'Reach training level 5',
        icon: '🎯',
        target: 5,
        current: state.trainingLevel,
        reward: 20,
        completed: state.trainingLevel >= 5,
        category: 'bladder',
      },
      {
        id: 'capacity_800',
        title: 'Capacity Builder',
        description: 'Increase max capacity to 800ml',
        icon: '📈',
        target: 800,
        current: state.maxCapacity,
        reward: 25,
        completed: state.maxCapacity >= 800,
        category: 'bladder',
      },

      // Social challenges
      {
        id: 'followers_50',
        title: 'Rising Star',
        description: 'Reach 50 followers',
        icon: '👥',
        target: 50,
        current: state.followerCount,
        reward: 20,
        completed: state.followerCount >= 50,
        category: 'social',
      },
      {
        id: 'post_5',
        title: 'Content Creator',
        description: 'Make 5 posts',
        icon: '📝',
        target: 5,
        current: state.playerAccount.posts.length,
        reward: 15,
        completed: state.playerAccount.posts.length >= 5,
        category: 'social',
      },
      {
        id: 'suggest_3',
        title: 'Helpful Friend',
        description: 'Make 3 suggestions',
        icon: '💡',
        target: 3,
        current: state.playerAccount.playerSuggestions.length,
        reward: 10,
        completed: state.playerAccount.playerSuggestions.length >= 3,
        category: 'social',
      },

      // Vitals challenges
      {
        id: 'heart_100',
        title: 'Elevated Heart',
        description: 'Reach 100 BPM heart rate',
        icon: '❤️',
        target: 100,
        current: state.heartRate,
        reward: 10,
        completed: state.heartRate >= 100,
        category: 'vitals',
      },
      {
        id: 'o2_95',
        title: 'Well Oxygenated',
        description: 'Maintain 95%+ O₂ level',
        icon: '🫁',
        target: 95,
        current: state.bloodO2Level,
        reward: 15,
        completed: state.bloodO2Level >= 95,
        category: 'vitals',
      },
      {
        id: 'stress_low',
        title: 'Zen Master',
        description: 'Keep stress below 30%',
        icon: '🧘',
        target: 30,
        current: 100 - state.stressLevel,
        reward: 20,
        completed: state.stressLevel < 30,
        category: 'vitals',
      },

      // Economy challenges
      {
        id: 'earn_100',
        title: 'Money Maker',
        description: 'Earn $100 total',
        icon: '💰',
        target: 100,
        current: state.totalEarned,
        reward: 25,
        completed: state.totalEarned >= 100,
        category: 'economy',
      },
      {
        id: 'donations_5',
        title: 'Stream Star',
        description: 'Receive 5 donations',
        icon: '🎁',
        target: 5,
        current: state.liveDonations.length,
        reward: 15,
        completed: state.liveDonations.length >= 5,
        category: 'economy',
      },
    ];

    // Select 5 random challenges for today
    const shuffled = newChallenges.sort(() => 0.5 - Math.random());
    setChallenges(shuffled.slice(0, 5));
    setLastGeneratedDay(state.dayNumber);
  };

  useEffect(() => {
    generateDailyChallenges();
  }, [state.dayNumber, state.bladderVolume, state.trainingLevel, state.maxCapacity, 
      state.followerCount, state.playerAccount.posts.length, state.playerAccount.playerSuggestions.length,
      state.heartRate, state.bloodO2Level, state.stressLevel, state.totalEarned, state.liveDonations.length]);

  const completedCount = challenges.filter(c => c.completed).length;
  const totalReward = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0);

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">🎯 Daily Challenges</h3>
        <div className="text-sm text-gray-400">
          Day {state.dayNumber} • {completedCount}/{challenges.length} completed
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Loading challenges...
        </div>
      ) : (
        <div className="space-y-3">
          {challenges.map(challenge => (
            <div
              key={challenge.id}
              className={`bg-gray-800/50 border rounded-lg p-3 ${
                challenge.completed ? 'border-green-500/50' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{challenge.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{challenge.title}</h4>
                    {challenge.completed && (
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">✓ Complete</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{challenge.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.min(challenge.current, challenge.target)}/{challenge.target}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (challenge.current / challenge.target) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="mt-2 text-xs text-gray-400">
                    Reward: <span className="text-green-400 font-bold">${challenge.reward}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {completedCount > 0 && (
        <div className="mt-4 bg-green-900/20 border border-green-700/50 rounded-lg p-3">
          <div className="text-sm text-green-400 font-bold">
            🎉 Daily Progress: {completedCount}/{challenges.length} challenges completed
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total rewards earned: <span className="text-green-400 font-bold">${totalReward}</span>
          </div>
        </div>
      )}
    </div>
  );
}
