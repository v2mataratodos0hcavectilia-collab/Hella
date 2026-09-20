import React from 'react';
import { SimulationState } from '../types';

interface MoodRingProps {
  state: SimulationState;
}

export default function MoodRing({ state }: MoodRingProps) {
  // Calculate mood based on various factors
  const calculateMood = () => {
    let moodScore = 50; // Base mood

    // Bladder fullness affects mood
    const fillRatio = state.bladderVolume / state.maxCapacity;
    if (fillRatio > 0.9) moodScore -= 30;
    else if (fillRatio > 0.7) moodScore -= 15;
    else if (fillRatio < 0.2) moodScore -= 10;

    // Urge signal affects mood
    if (state.urgeSignal > 100) moodScore -= 25;
    else if (state.urgeSignal > 70) moodScore -= 15;
    else if (state.urgeSignal < 30) moodScore += 10;

    // Stress affects mood
    moodScore -= state.stressLevel * 0.3;

    // Vitals affect mood
    if (state.heartRate > 120) moodScore -= 10;
    if (state.breathingRate > 25) moodScore -= 5;
    if (state.bloodO2Level < 90) moodScore -= 15;

    // Full bladder preference trait
    if (state.fullBladderPreference && fillRatio > 0.7) {
      moodScore += 20;
    }

    // Weather affects mood
    if (state.weather === 'stormy') moodScore -= 10;
    if (state.weather === 'clear' && state.timeOfDay === 'morning') moodScore += 5;

    // Social media success
    if (state.followerCount > 100) moodScore += 10;
    if (state.isLiveStreaming) moodScore += 5;

    return Math.max(0, Math.min(100, moodScore));
  };

  const moodScore = calculateMood();
  const fillRatio = state.bladderVolume / state.maxCapacity;

  const getMoodInfo = () => {
    if (moodScore >= 80) return { emoji: '😊', label: 'Ecstatic', color: 'text-green-400', bgColor: 'bg-green-500' };
    if (moodScore >= 60) return { emoji: '🙂', label: 'Happy', color: 'text-green-300', bgColor: 'bg-green-400' };
    if (moodScore >= 40) return { emoji: '😐', label: 'Neutral', color: 'text-yellow-400', bgColor: 'bg-yellow-400' };
    if (moodScore >= 20) return { emoji: '😟', label: 'Stressed', color: 'text-orange-400', bgColor: 'bg-orange-400' };
    return { emoji: '😫', label: 'Miserable', color: 'text-red-400', bgColor: 'bg-red-500' };
  };

  const moodInfo = getMoodInfo();

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-3">
      <div className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
        💭 Mood Ring
      </div>
      
      <div className="flex items-center gap-3">
        {/* Mood emoji */}
        <div className="text-4xl">{moodInfo.emoji}</div>
        
        {/* Mood info */}
        <div className="flex-1">
          <div className={`text-sm font-bold ${moodInfo.color}`}>
            {moodInfo.label}
          </div>
          <div className="text-xs text-gray-400">
            Score: {moodScore.toFixed(0)}/100
          </div>
          
          {/* Mood bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full ${moodInfo.bgColor} transition-all duration-500`}
              style={{ width: `${moodScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mood factors */}
      <div className="mt-3 text-[10px] text-gray-500 space-y-0.5">
        {fillRatio > 0.7 && <div>• High bladder volume</div>}
        {state.urgeSignal > 70 && <div>• Strong urge signal</div>}
        {state.stressLevel > 50 && <div>• High stress level</div>}
        {state.fullBladderPreference && fillRatio > 0.7 && <div>• Enjoying full bladder</div>}
        {state.followerCount > 100 && <div>• Social media success</div>}
      </div>
    </div>
  );
}
