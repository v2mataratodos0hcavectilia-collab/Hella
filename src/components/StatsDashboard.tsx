import { SimulationState } from '../types';
import { ACHIEVEMENTS } from '../achievements';

interface StatsDashboardProps {
  state: SimulationState;
  showPredictions?: boolean;
}

export default function StatsDashboard({ state, showPredictions = false }: StatsDashboardProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const totalPosts = state.socialMediaPosts.filter(p => p.isFromUser).length;
  const totalComments = state.socialMediaPosts.reduce((sum, p) => sum + (p.commentList?.length || 0), 0);
  const totalSuggestions = state.playerAccount.playerSuggestions.length;
  const acceptedSuggestions = state.playerAccount.playerSuggestions.filter(s => s.accepted).length;

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <h3 className="text-lg font-bold text-white mb-4">📊 Statistics Dashboard</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Bladder Stats */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">💧 Bladder</div>
          <div className="text-2xl font-bold text-blue-400">{state.bladderVolume.toFixed(0)}ml</div>
          <div className="text-xs text-gray-500">of {state.maxCapacity}ml capacity</div>
          <div className="mt-2 text-xs">
            <div className="text-gray-400">Training Level: <span className="text-blue-400">{state.trainingLevel}</span></div>
            <div className="text-gray-400">Last Void: <span className="text-blue-400">{formatTime(state.simTime - state.lastVoidTime)} ago</span></div>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">❤️ Vitals</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Heart Rate:</span>
              <span className="text-red-400 font-bold">{state.heartRate.toFixed(0)} BPM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Breathing:</span>
              <span className="text-blue-400 font-bold">{state.breathingRate.toFixed(0)} BrPM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Blood Pressure:</span>
              <span className="text-purple-400 font-bold">{state.bloodPressure.toFixed(0)} mmHg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">O₂ Level:</span>
              <span className="text-green-400 font-bold">{state.bloodO2Level.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">📱 Social</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Followers:</span>
              <span className="text-blue-400 font-bold">{state.followerCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Posts:</span>
              <span className="text-blue-400 font-bold">{totalPosts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Comments:</span>
              <span className="text-blue-400 font-bold">{totalComments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Suggestions:</span>
              <span className="text-blue-400 font-bold">{acceptedSuggestions}/{totalSuggestions}</span>
            </div>
          </div>
        </div>

        {/* Economy Stats */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">💰 Economy</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Current:</span>
              <span className="text-green-400 font-bold">${state.money.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Earned:</span>
              <span className="text-green-400 font-bold">${state.totalEarned.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly Expenses:</span>
              <span className="text-red-400 font-bold">${state.monthlyExpenses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Career Level:</span>
              <span className="text-blue-400 font-bold">{state.careerLevel}</span>
            </div>
          </div>
        </div>

        {/* Time Stats */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">⏰ Time</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Day:</span>
              <span className="text-blue-400 font-bold">{state.dayNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time:</span>
              <span className="text-blue-400 font-bold">{formatTime(state.simTime % 86400)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Season:</span>
              <span className="text-blue-400 font-bold capitalize">{state.season}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weather:</span>
              <span className="text-blue-400 font-bold capitalize">{state.weather}</span>
            </div>
          </div>
        </div>

        {/* Status Stats */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">🎯 Status</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Consciousness:</span>
              <span className={`font-bold ${state.consciousnessLevel < 20 ? 'text-red-400' : state.consciousnessLevel < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                {state.consciousnessLevel.toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stress Level:</span>
              <span className={`font-bold ${state.stressLevel > 70 ? 'text-red-400' : state.stressLevel > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                {state.stressLevel.toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Urge Signal:</span>
              <span className={`font-bold ${state.urgeSignal > 80 ? 'text-red-400' : state.urgeSignal > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                {state.urgeSignal.toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-blue-400 font-bold capitalize">{state.location.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Active Drugs */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">💊 Active Drugs</div>
          {state.activeDrugs.length === 0 ? (
            <div className="text-xs text-gray-500">None</div>
          ) : (
            <div className="space-y-1 text-xs">
              {state.activeDrugs.slice(0, 4).map((drug, i) => {
                const remaining = Math.max(0, drug.duration - (state.simTime - drug.startTime));
                return (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-400 capitalize">{drug.type.replace('_', ' ')}</span>
                    <span className="text-blue-400 font-bold">{formatTime(remaining)}</span>
                  </div>
                );
              })}
              {state.activeDrugs.length > 4 && (
                <div className="text-gray-500">+{state.activeDrugs.length - 4} more</div>
              )}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">🏆 Achievements</div>
          <div className="text-2xl font-bold text-yellow-400">{state.unlockedAchievements.length}</div>
          <div className="text-xs text-gray-500">unlocked</div>
          <div className="mt-2 text-xs text-gray-400">
            Total earned: <span className="text-green-400 font-bold">
              ${state.unlockedAchievements.reduce((sum, id) => {
                const achievement = ACHIEVEMENTS.find(a => a.id === id);
                return sum + (achievement?.reward || 0);
              }, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Prediction System */}
      {showPredictions && (
        <div className="mt-4 bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
          <div className="text-xs text-blue-400 font-bold mb-2">🔮 AI Prediction</div>
          <div className="text-sm text-gray-300">
            Based on current bladder volume and fill rate, you'll need to use the bathroom in approximately{' '}
            <span className="text-blue-400 font-bold">
              {Math.max(0, Math.floor((state.maxCapacity - state.bladderVolume) / (state.fillRate * 60)))} minutes
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
