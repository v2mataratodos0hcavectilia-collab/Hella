import { useState } from 'react';
import { SimulationState } from '../types';
import { ACHIEVEMENTS } from '../achievements';

interface AchievementsPanelProps {
  state: SimulationState;
}

export default function AchievementsPanel({ state }: AchievementsPanelProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  const unlockedCount = state.unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">🏆 Achievements</h3>
        <span className="text-sm text-gray-400">
          {unlockedCount} / {totalCount} unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = state.unlockedAchievements.includes(achievement.id);
          const progress = achievement.getProgress ? achievement.getProgress(state) : 0;
          const maxProgress = achievement.getMaxProgress ? achievement.getMaxProgress() : 1;
          const progressPercent = Math.min(100, (progress / maxProgress) * 100);

          return (
            <div
              key={achievement.id}
              className={`relative p-3 rounded-lg border-2 transition-all cursor-pointer ${
                isUnlocked
                  ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-600'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedAchievement(isUnlocked ? achievement.id : null)}
            >
              <div className="flex items-start justify-between mb-1">
                <span className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.id.includes('capacity') ? '💧' :
                   achievement.id.includes('hold') ? '⏱️' :
                   achievement.id.includes('followers') ? '👥' :
                   achievement.id.includes('stream') ? '📺' :
                   achievement.id.includes('drug') ? '💊' :
                   achievement.id.includes('training') ? '🎯' :
                   achievement.id.includes('earned') ? '💰' : '🏆'}
                </span>
                {isUnlocked && (
                  <span className="text-yellow-400 text-xs font-bold">+${achievement.reward}</span>
                )}
              </div>

              <h4 className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-yellow-300' : 'text-gray-300'}`}>
                {achievement.name}
              </h4>

              {!isUnlocked && achievement.getProgress && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {isUnlocked && selectedAchievement === achievement.id && (
                <div className="mt-2 pt-2 border-t border-yellow-700/50">
                  <p className="text-xs text-yellow-200">{achievement.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {unlockedCount === 0 && (
        <div className="text-center text-gray-500 mt-4">
          <p>Keep playing to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}
