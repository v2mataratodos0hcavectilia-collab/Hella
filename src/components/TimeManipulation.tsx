import { useState } from 'react';
import { SimulationState } from '../types';

interface TimeManipulationProps {
  state: SimulationState;
  setTimeSpeed: (speed: number) => void;
  togglePause: () => void;
  jumpTime: (seconds: number) => void;
}

export default function TimeManipulation({ state, setTimeSpeed, togglePause, jumpTime }: TimeManipulationProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const timePresets = [
    { label: 'Real-time', speed: 1, icon: '⏱️', description: '5 real min = 1 sim hour' },
    { label: 'Fast', speed: 15, icon: '⏩', description: '4 real min = 1 sim hour' },
    { label: 'Very Fast', speed: 60, icon: '⏭️', description: '1 real min = 1 sim hour' },
    { label: 'Extreme', speed: 150, icon: '🚀', description: '24 real sec = 1 sim hour' },
  ];

  const advancedPresets = [
    { label: 'Slow Motion', speed: 0.5, icon: '🐌', description: '10 real min = 1 sim hour' },
    { label: 'Ultra Slow', speed: 0.25, icon: '🦥', description: '20 real min = 1 sim hour' },
    { label: 'Hyper Fast', speed: 300, icon: '⚡', description: '12 real sec = 1 sim hour' },
    { label: 'Maximum', speed: 500, icon: '💫', description: '7 real sec = 1 sim hour' },
  ];

  const formatSimTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600) % 24;
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getTimeOfDay = () => {
    const hour = Math.floor((state.simTime % 86400) / 3600);
    if (hour >= 5 && hour < 12) return '🌅 Morning';
    if (hour >= 12 && hour < 17) return '☀️ Afternoon';
    if (hour >= 17 && hour < 21) return '🌆 Evening';
    return '🌙 Night';
  };

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">⏰ Time Manipulation</h3>
        <button
          onClick={togglePause}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            state.isPaused
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
        >
          {state.isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
      </div>

      {/* Current Time Display */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Current Time:</span>
          <span className="text-lg font-bold text-white font-mono">{formatSimTime(state.simTime)}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Time of Day:</span>
          <span className="text-sm font-bold text-blue-400">{getTimeOfDay()}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Day:</span>
          <span className="text-sm font-bold text-purple-400">Day {state.dayNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Speed:</span>
          <span className="text-sm font-bold text-yellow-400">{state.timeSpeed}× {state.isPaused ? '(Paused)' : ''}</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Quick Presets:</div>
        <div className="grid grid-cols-2 gap-2">
          {timePresets.map((preset) => (
            <button
              key={preset.speed}
              onClick={() => setTimeSpeed(preset.speed)}
              className={`p-3 rounded-lg border-2 transition-all ${
                state.timeSpeed === preset.speed && !state.isPaused
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="text-sm font-bold text-white">{preset.label}</div>
              <div className="text-xs text-gray-400">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Presets */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-left text-sm text-gray-400 mb-2 hover:text-gray-300"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Time Controls
        </button>
        
        {showAdvanced && (
          <div className="grid grid-cols-2 gap-2">
            {advancedPresets.map((preset) => (
              <button
                key={preset.speed}
                onClick={() => setTimeSpeed(preset.speed)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  state.timeSpeed === preset.speed && !state.isPaused
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{preset.icon}</div>
                <div className="text-sm font-bold text-white">{preset.label}</div>
                <div className="text-xs text-gray-400">{preset.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Speed */}
      <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-lg p-3">
        <div className="text-sm text-gray-400 mb-2">Custom Speed:</div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.1"
            max="500"
            step="0.1"
            value={state.timeSpeed}
            onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-bold text-white font-mono w-16 text-right">
            {state.timeSpeed}×
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Range: 0.1× (ultra slow) to 500× (maximum speed)
        </div>
      </div>

      {/* Time Jump Shortcuts */}
      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-2">Quick Time Jumps:</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => jumpTime(3600)}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-white"
          >
            +1 Hour
          </button>
          <button
            onClick={() => jumpTime(21600)}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-white"
          >
            +6 Hours
          </button>
          <button
            onClick={() => jumpTime(86400)}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-white"
          >
            +1 Day
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Jump forward in simulation time
        </div>
      </div>
    </div>
  );
}
