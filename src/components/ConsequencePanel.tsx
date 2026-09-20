import { SimulationState } from '../types';

interface ConsequencePanelProps {
  state: SimulationState;
}

export default function ConsequencePanel({ state }: ConsequencePanelProps) {
  const getHealthStatus = (value: number) => {
    if (value < 20) return { color: 'text-green-400', label: 'Excellent' };
    if (value < 40) return { color: 'text-blue-400', label: 'Good' };
    if (value < 60) return { color: 'text-yellow-400', label: 'Fair' };
    if (value < 80) return { color: 'text-orange-400', label: 'Poor' };
    return { color: 'text-red-400', label: 'Critical' };
  };

  const bladderStatus = getHealthStatus(state.healthEffects.bladderDamage);
  const stressStatus = getHealthStatus(state.healthEffects.stressAccumulation);
  const fatigueStatus = getHealthStatus(state.healthEffects.fatigue);
  const hydrationStatus = getHealthStatus(100 - state.healthEffects.hydration); // Invert for display

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <h3 className="text-lg font-bold text-white mb-4">⚠️ Consequence System</h3>

      {/* Health Effects */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-300 mb-3">💊 Health Effects</h4>
        <div className="space-y-3">
          {/* Bladder Damage */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Bladder Damage</span>
              <span className={`text-xs font-bold ${bladderStatus.color}`}>
                {state.healthEffects.bladderDamage.toFixed(1)}% - {bladderStatus.label}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  state.healthEffects.bladderDamage < 20 ? 'bg-green-500' :
                  state.healthEffects.bladderDamage < 40 ? 'bg-blue-500' :
                  state.healthEffects.bladderDamage < 60 ? 'bg-yellow-500' :
                  state.healthEffects.bladderDamage < 80 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${state.healthEffects.bladderDamage}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {state.healthEffects.bladderDamage > 50 ? '⚠️ Long-term holding damage' : 'Healthy bladder function'}
            </div>
          </div>

          {/* Stress Accumulation */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Stress Accumulation</span>
              <span className={`text-xs font-bold ${stressStatus.color}`}>
                {state.healthEffects.stressAccumulation.toFixed(1)}% - {stressStatus.label}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  state.healthEffects.stressAccumulation < 20 ? 'bg-green-500' :
                  state.healthEffects.stressAccumulation < 40 ? 'bg-blue-500' :
                  state.healthEffects.stressAccumulation < 60 ? 'bg-yellow-500' :
                  state.healthEffects.stressAccumulation < 80 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${state.healthEffects.stressAccumulation}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {state.healthEffects.stressAccumulation > 50 ? '⚠️ Chronic stress buildup' : 'Normal stress levels'}
            </div>
          </div>

          {/* Fatigue */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Fatigue</span>
              <span className={`text-xs font-bold ${fatigueStatus.color}`}>
                {state.healthEffects.fatigue.toFixed(1)}% - {fatigueStatus.label}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  state.healthEffects.fatigue < 20 ? 'bg-green-500' :
                  state.healthEffects.fatigue < 40 ? 'bg-blue-500' :
                  state.healthEffects.fatigue < 60 ? 'bg-yellow-500' :
                  state.healthEffects.fatigue < 80 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${state.healthEffects.fatigue}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {state.healthEffects.fatigue > 50 ? '⚠️ Severe fatigue - need sleep' : 'Well rested'}
            </div>
          </div>

          {/* Hydration */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Hydration</span>
              <span className={`text-xs font-bold ${hydrationStatus.color}`}>
                {state.healthEffects.hydration.toFixed(1)}% - {hydrationStatus.label}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  state.healthEffects.hydration > 80 ? 'bg-green-500' :
                  state.healthEffects.hydration > 60 ? 'bg-blue-500' :
                  state.healthEffects.hydration > 40 ? 'bg-yellow-500' :
                  state.healthEffects.hydration > 20 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${state.healthEffects.hydration}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {state.healthEffects.hydration < 50 ? '⚠️ Dehydration risk' : 'Well hydrated'}
            </div>
          </div>
        </div>
      </div>

      {/* Reputation & Career */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-300 mb-3">📈 Social & Career</h4>
        <div className="space-y-3">
          {/* Reputation */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Reputation</span>
              <span className="text-xs font-bold text-purple-400">
                {state.reputation.toFixed(1)}/100
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all"
                style={{ width: `${state.reputation}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {state.reputation > 80 ? '🌟 Influencer status' :
               state.reputation > 60 ? '👍 Well respected' :
               state.reputation > 40 ? '👌 Average reputation' :
               state.reputation > 20 ? '👎 Low reputation' : '⚠️ Poor reputation'}
            </div>
          </div>

          {/* Career Progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Career Progress</span>
              <span className="text-xs font-bold text-blue-400">
                {state.careerProgress.toFixed(1)}/100
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${state.careerProgress}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {state.careerProgress > 80 ? '🏆 Senior position' :
               state.careerProgress > 60 ? '💼 Mid-level' :
               state.careerProgress > 40 ? '📊 Junior position' :
               state.careerProgress > 20 ? '🌱 Entry level' : '🆕 Just started'}
            </div>
          </div>
        </div>
      </div>

      {/* Relationships */}
      <div>
        <h4 className="text-sm font-bold text-gray-300 mb-3">❤️ Relationships</h4>
        <div className="space-y-2">
          {Object.entries(state.relationshipStatus).map(([name, closeness]) => (
            <div key={name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 capitalize">{name}</span>
                <span className={`text-xs font-bold ${
                  closeness > 80 ? 'text-green-400' :
                  closeness > 60 ? 'text-blue-400' :
                  closeness > 40 ? 'text-yellow-400' :
                  closeness > 20 ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  {closeness.toFixed(1)}/100
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    closeness > 80 ? 'bg-green-500' :
                    closeness > 60 ? 'bg-blue-500' :
                    closeness > 40 ? 'bg-yellow-500' :
                    closeness > 20 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${closeness}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {closeness > 80 ? '💕 Very close' :
                 closeness > 60 ? '😊 Good relationship' :
                 closeness > 40 ? '👋 Friendly' :
                 closeness > 20 ? '😐 Distant' : '💔 Strained'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {(state.healthEffects.bladderDamage > 70 || 
        state.healthEffects.stressAccumulation > 70 ||
        state.healthEffects.fatigue > 70 ||
        state.healthEffects.hydration < 30) && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
          <div className="text-sm font-bold text-red-400 mb-2">⚠️ Health Warnings</div>
          <div className="text-xs text-red-300 space-y-1">
            {state.healthEffects.bladderDamage > 70 && (
              <div>• Severe bladder damage - consider reducing holding time</div>
            )}
            {state.healthEffects.stressAccumulation > 70 && (
              <div>• Chronic stress - take time to relax</div>
            )}
            {state.healthEffects.fatigue > 70 && (
              <div>• Extreme fatigue - get some sleep</div>
            )}
            {state.healthEffects.hydration < 30 && (
              <div>• Dehydration risk - drink water</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
