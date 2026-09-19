import { SimulationState } from '../types';

interface PredictionSystemProps {
  state: SimulationState;
}

export default function PredictionSystem({ state }: PredictionSystemProps) {
  // Calculate time until bladder is full
  const currentVolume = state.bladderVolume;
  const maxCapacity = state.maxCapacity;
  const fillRate = state.fillRate * state.diureticMultiplier; // ml per minute
  
  // Time until full (in minutes)
  const volumeRemaining = maxCapacity - currentVolume;
  const minutesUntilFull = fillRate > 0 ? volumeRemaining / fillRate : Infinity;
  
  // Time until urgent (80% capacity)
  const urgentThreshold = maxCapacity * 0.8;
  const volumeUntilUrgent = urgentThreshold - currentVolume;
  const minutesUntilUrgent = fillRate > 0 && volumeUntilUrgent > 0 
    ? volumeUntilUrgent / fillRate 
    : 0;
  
  // Time until critical (95% capacity)
  const criticalThreshold = maxCapacity * 0.95;
  const volumeUntilCritical = criticalThreshold - currentVolume;
  const minutesUntilCritical = fillRate > 0 && volumeUntilCritical > 0
    ? volumeUntilCritical / fillRate
    : 0;

  // Format time
  const formatTime = (minutes: number) => {
    if (minutes === Infinity) return '∞';
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.floor(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Determine urgency level
  const getUrgencyLevel = () => {
    const percentage = (currentVolume / maxCapacity) * 100;
    if (percentage >= 95) return { level: 'critical', color: 'text-red-500', bg: 'bg-red-900/20', border: 'border-red-500/50' };
    if (percentage >= 80) return { level: 'urgent', color: 'text-orange-500', bg: 'bg-orange-900/20', border: 'border-orange-500/50' };
    if (percentage >= 60) return { level: 'moderate', color: 'text-yellow-500', bg: 'bg-yellow-900/20', border: 'border-yellow-500/50' };
    return { level: 'low', color: 'text-green-500', bg: 'bg-green-900/20', border: 'border-green-500/50' };
  };

  const urgency = getUrgencyLevel();

  // Calculate confidence based on various factors
  const calculateConfidence = () => {
    let confidence = 85; // Base confidence
    
    // Lower confidence if drugs are active
    if (state.activeDrugs.length > 0) {
      confidence -= state.activeDrugs.length * 5;
    }
    
    // Lower confidence if stress is high
    if (state.stressLevel > 70) {
      confidence -= 10;
    }
    
    // Lower confidence if temperature is extreme
    if (state.temperature < 60 || state.temperature > 90) {
      confidence -= 5;
    }
    
    return Math.max(50, Math.min(95, confidence));
  };

  const confidence = calculateConfidence();

  return (
    <div className={`border rounded-lg p-4 ${urgency.bg} ${urgency.border}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          🔮 Prediction System
        </h3>
        <div className="text-xs text-gray-400">
          Confidence: {confidence}%
        </div>
      </div>

      {/* Current Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Current Status:</span>
          <span className={`text-sm font-bold ${urgency.color}`}>
            {urgency.level.toUpperCase()}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              urgency.level === 'critical' ? 'bg-red-500' :
              urgency.level === 'urgent' ? 'bg-orange-500' :
              urgency.level === 'moderate' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${(currentVolume / maxCapacity) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{currentVolume.toFixed(0)}ml</span>
          <span>{maxCapacity}ml</span>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⚠️</span>
            <span className="text-sm text-gray-300">Until Urgent (80%):</span>
          </div>
          <span className="text-sm font-bold text-yellow-400">
            {minutesUntilUrgent > 0 ? formatTime(minutesUntilUrgent) : 'NOW'}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
          <div className="flex items-center gap-2">
            <span className="text-orange-500">🚨</span>
            <span className="text-sm text-gray-300">Until Critical (95%):</span>
          </div>
          <span className="text-sm font-bold text-orange-400">
            {minutesUntilCritical > 0 ? formatTime(minutesUntilCritical) : 'NOW'}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
          <div className="flex items-center gap-2">
            <span className="text-red-500">💥</span>
            <span className="text-sm text-gray-300">Until Full (100%):</span>
          </div>
          <span className="text-sm font-bold text-red-400">
            {formatTime(minutesUntilFull)}
          </span>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-2">💡 AI Recommendations:</div>
        <div className="space-y-1 text-sm text-gray-300">
          {minutesUntilUrgent < 30 && minutesUntilUrgent > 0 && (
            <div className="flex items-center gap-2">
              <span>🚻</span>
              <span>Consider finding a bathroom soon</span>
            </div>
          )}
          {minutesUntilCritical < 15 && minutesUntilCritical > 0 && (
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Urgent bathroom break needed within 15 minutes</span>
            </div>
          )}
          {state.activeDrugs.some(d => d.type === 'blazex') && (
            <div className="flex items-center gap-2">
              <span>💊</span>
              <span>Diuretic active - bladder filling faster than normal</span>
            </div>
          )}
          {state.stressLevel > 70 && (
            <div className="flex items-center gap-2">
              <span>😰</span>
              <span>High stress may increase urge frequency</span>
            </div>
          )}
          {state.temperature < 60 && (
            <div className="flex items-center gap-2">
              <span>🥶</span>
              <span>Cold temperature increases bladder activity</span>
            </div>
          )}
          {minutesUntilFull > 120 && (
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>You have plenty of time before needing a bathroom</span>
            </div>
          )}
        </div>
      </div>

      {/* Fill Rate Info */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-2">📊 Current Fill Rate:</div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Base Rate:</span>
          <span className="text-sm font-bold text-blue-400">{state.fillRate.toFixed(1)} ml/min</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Effective Rate:</span>
          <span className="text-sm font-bold text-blue-400">{fillRate.toFixed(1)} ml/min</span>
        </div>
        {state.diureticMultiplier !== 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Multiplier:</span>
            <span className="text-sm font-bold text-purple-400">{state.diureticMultiplier.toFixed(1)}×</span>
          </div>
        )}
      </div>
    </div>
  );
}
