import { SimulationState } from '../types';

interface WeatherPanelProps {
  state: SimulationState;
}

export default function WeatherPanel({ state }: WeatherPanelProps) {
  const getWeatherIcon = () => {
    switch (state.weather) {
      case 'clear': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '🌨️';
      case 'stormy': return '⛈️';
      case 'hot': return '🔥';
      case 'cold': return '❄️';
      default: return '☀️';
    }
  };

  const getSeasonIcon = () => {
    switch (state.season) {
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      case 'fall': return '🍂';
      case 'winter': return '❄️';
      default: return '🌸';
    }
  };

  const getTimeIcon = () => {
    switch (state.timeOfDay) {
      case 'dawn': return '🌅';
      case 'morning': return '🌤️';
      case 'afternoon': return '☀️';
      case 'evening': return '🌆';
      case 'night': return '🌙';
      default: return '☀️';
    }
  };

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-3">
      <div className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
        🌍 Environment
      </div>
      
      <div className="space-y-2">
        {/* Weather */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Weather:</span>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getWeatherIcon()}</span>
            <span className="text-xs text-gray-300 capitalize">{state.weather}</span>
          </div>
        </div>
        
        {/* Season */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Season:</span>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getSeasonIcon()}</span>
            <span className="text-xs text-gray-300 capitalize">{state.season}</span>
          </div>
        </div>
        
        {/* Time of Day */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Time:</span>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTimeIcon()}</span>
            <span className="text-xs text-gray-300 capitalize">{state.timeOfDay}</span>
          </div>
        </div>
        
        {/* Stress Level */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Stress:</span>
            <span className={`text-xs font-bold ${
              state.stressLevel > 70 ? 'text-red-400' : 
              state.stressLevel > 40 ? 'text-yellow-400' : 
              'text-green-400'
            }`}>
              {state.stressLevel.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                state.stressLevel > 70 ? 'bg-red-500' : 
                state.stressLevel > 40 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${state.stressLevel}%` }}
            />
          </div>
        </div>
        
        {/* Last Food */}
        {state.lastFoodEaten && (
          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Last Food:</span>
              <span className="text-xs text-gray-300 capitalize">
                {state.lastFoodEaten.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
