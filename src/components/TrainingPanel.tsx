import { SimulationState, TrainingMethod, TrainingScenario } from '../types';

interface TrainingPanelProps {
  state: SimulationState;
  setTrainingMethod: (method: TrainingMethod) => void;
  toggleBladderControlMode: () => void;
}

export default function TrainingPanel({ state, setTrainingMethod, toggleBladderControlMode }: TrainingPanelProps) {
  const trainingMethods: { method: TrainingMethod; icon: string; description: string }[] = [
    { method: 'none', icon: '⭕', description: 'No special training' },
    { method: 'kegels', icon: '💪', description: 'Kegel exercises - improves control' },
    { method: 'meditation', icon: '🧘', description: 'Meditation - reduces urgency perception' },
    { method: 'cold_exposure', icon: '🧊', description: 'Cold exposure - increases capacity' },
    { method: 'interval', icon: '⏱️', description: 'Interval training - builds endurance' },
  ];

  const scenarios: { scenario: TrainingScenario; icon: string }[] = [
    { scenario: 'sitting', icon: '🪑' },
    { scenario: 'standing', icon: '🧍' },
    { scenario: 'walking', icon: '🚶' },
    { scenario: 'running', icon: '🏃' },
    { scenario: 'sleeping', icon: '😴' },
    { scenario: 'social', icon: '👥' },
  ];

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-3">
      <div className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
        🎯 Training Specialization
      </div>
      
      {/* Bladder Control Mode Toggle */}
      <div className="mb-3">
        <button
          onClick={toggleBladderControlMode}
          className={`w-full px-3 py-2 rounded text-xs font-bold transition-colors ${
            state.bladderControlMode
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {state.bladderControlMode ? '✅ Bladder Control: ON' : '⭕ Bladder Control: OFF'}
        </button>
        {state.bladderControlMode && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400">Control Level:</span>
              <span className="text-[10px] text-green-400 font-bold">{state.bladderControlLevel.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
                style={{ width: `${state.bladderControlLevel}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Training Method Selection */}
      <div className="mb-3">
        <div className="text-[10px] text-gray-400 mb-1">Training Method:</div>
        <div className="grid grid-cols-5 gap-1">
          {trainingMethods.map(({ method, icon, description }) => (
            <button
              key={method}
              onClick={() => setTrainingMethod(method)}
              className={`px-1 py-2 rounded text-xs transition-colors ${
                state.trainingMethod === method
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={description}
            >
              <div className="text-lg">{icon}</div>
              <div className="text-[9px] capitalize">{method}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Training Specializations by Scenario */}
      <div>
        <div className="text-[10px] text-gray-400 mb-1">Scenario Training Levels:</div>
        <div className="grid grid-cols-3 gap-1">
          {scenarios.map(({ scenario, icon }) => {
            const level = state.trainingSpecializations[scenario] || 0;
            return (
              <div key={scenario} className="bg-gray-800/50 border border-gray-700 rounded p-1.5">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm">{icon}</span>
                  <span className="text-[10px] text-gray-300 font-bold">{level.toFixed(0)}</span>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${level}%` }}
                  />
                </div>
                <div className="text-[8px] text-gray-500 capitalize mt-0.5">{scenario}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
