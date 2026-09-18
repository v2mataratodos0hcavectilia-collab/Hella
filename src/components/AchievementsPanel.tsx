import { useState, useRef } from 'react';
import { SimulationState } from '../types';
import { ACHIEVEMENTS } from '../achievements';

interface AchievementsPanelProps {
  state: SimulationState;
}

export default function AchievementsPanel({ state }: AchievementsPanelProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const unlockedCount = state.unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance && scrollRef.current) {
      const scrollAmount = 300;
      if (swipeDistance > 0) {
        // Swipe left - scroll right
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        // Swipe right - scroll left
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-yellow-950 via-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-800 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/80 border-b border-gray-700 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <h2 className="text-lg font-bold text-white">Achievements</h2>
            <p className="text-xs text-gray-400">
              {unlockedCount} / {totalCount} unlocked
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Total Earned</div>
          <div className="text-sm font-bold text-green-400">
            ${state.unlockedAchievements.reduce((sum, id) => {
              const achievement = ACHIEVEMENTS.find(a => a.id === id);
              return sum + (achievement?.reward || 0);
            }, 0)}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = state.unlockedAchievements.includes(achievement.id);
            const progress = achievement.getProgress ? achievement.getProgress(state) : 0;
            const maxProgress = achievement.getMaxProgress ? achievement.getMaxProgress() : 1;
            const progressPercent = Math.min(100, (progress / maxProgress) * 100);

            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-600 shadow-lg shadow-yellow-600/20'
                    : 'bg-gray-800/60 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedAchievement(isUnlocked ? (selectedAchievement === achievement.id ? null : achievement.id) : null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-3xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.id.includes('capacity') ? '💧' :
                     achievement.id.includes('hold') ? '⏱️' :
                     achievement.id.includes('followers') ? '👥' :
                     achievement.id.includes('stream') ? '📺' :
                     achievement.id.includes('drug') ? '💊' :
                     achievement.id.includes('training') ? '🎯' :
                     achievement.id.includes('earned') ? '💰' : '🏆'}
                  </span>
                  {isUnlocked && (
                    <span className="text-yellow-400 text-xs font-bold bg-yellow-900/50 px-2 py-1 rounded">
                      +${achievement.reward}
                    </span>
                  )}
                </div>

                <h4 className={`text-sm font-bold mb-2 ${isUnlocked ? 'text-yellow-300' : 'text-gray-300'}`}>
                  {achievement.name}
                </h4>

                {!isUnlocked && achievement.getProgress && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {isUnlocked && selectedAchievement === achievement.id && (
                  <div className="mt-3 pt-3 border-t border-yellow-700/50">
                    <p className="text-xs text-yellow-200">{achievement.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {unlockedCount === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm">Keep playing to unlock achievements!</p>
            <p className="text-xs mt-1">Complete challenges to earn rewards</p>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="bg-gray-900/80 border-t border-gray-700 px-4 py-2 text-center shrink-0">
        <p className="text-xs text-gray-500">
          💡 Swipe left/right to scroll • Click unlocked achievements to view details
        </p>
      </div>
    </div>
  );
}
