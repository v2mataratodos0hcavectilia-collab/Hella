import { SimulationState } from '../types';

interface StatsPanelProps {
  state: SimulationState;
}

export default function StatsPanel({ state }: StatsPanelProps) {
  const fillPercent = (state.bladderVolume / state.maxCapacity) * 100;
  const pressureNorm = state.bladderPressure / 120;

  return (
    <div className="bg-gray-900/95 border-t border-gray-700 px-4 py-2 font-mono text-xs">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
        {/* Bladder Volume */}
        <StatItem
          label="BLADDER"
          value={`${state.bladderVolume.toFixed(0)} / ${state.maxCapacity.toFixed(0)} ml`}
          color={fillPercent > 100 ? 'text-red-400' : fillPercent > 80 ? 'text-yellow-400' : 'text-blue-400'}
          bar={fillPercent}
          barColor={fillPercent > 100 ? 'bg-red-500' : fillPercent > 80 ? 'bg-yellow-500' : 'bg-blue-500'}
        />

        {/* Pressure */}
        <StatItem
          label="PRESSURE"
          value={`${state.bladderPressure.toFixed(1)} cmH₂O`}
          color={pressureNorm > 0.8 ? 'text-red-400' : pressureNorm > 0.5 ? 'text-yellow-400' : 'text-green-400'}
        />

        {/* Urge */}
        <StatItem
          label="URGE"
          value={`${state.urgeSignal.toFixed(0)}%`}
          color={state.urgeSignal > 100 ? 'text-red-400 animate-pulse' : state.urgeSignal > 70 ? 'text-orange-400' : 'text-gray-300'}
          bar={state.urgeSignal}
          barColor={state.urgeSignal > 100 ? 'bg-red-500' : state.urgeSignal > 70 ? 'bg-orange-500' : 'bg-gray-500'}
        />

        {/* Sphincter */}
        <StatItem
          label="SPHINCTER"
          value={`${state.sphincterFatigue.toFixed(0)}% fatigue`}
          color={state.sphincterFatigue > 70 ? 'text-red-400' : state.sphincterFatigue > 40 ? 'text-yellow-400' : 'text-green-400'}
          bar={state.sphincterFatigue}
          barColor={state.sphincterFatigue > 70 ? 'bg-red-500' : state.sphincterFatigue > 40 ? 'bg-yellow-500' : 'bg-green-500'}
        />

        {/* Heart Rate */}
        <StatItem
          label="HR"
          value={`${state.heartRate.toFixed(0)} BPM`}
          color={state.heartRate > 100 ? 'text-red-400' : 'text-pink-400'}
        />

        {/* Breathing */}
        <StatItem
          label="RESP"
          value={`${state.breathingRate.toFixed(0)} BrPM`}
          color={state.breathingRate > 20 ? 'text-orange-400' : 'text-cyan-400'}
        />

        {/* Nerve Sensitivity */}
        <StatItem
          label="NERVES"
          value={`${state.nerveSensitivity.toFixed(0)}%`}
          color={state.nerveSensitivity < 50 ? 'text-purple-400' : 'text-gray-300'}
        />

        {/* Fill Rate */}
        <StatItem
          label="FILL"
          value={`${(state.fillRate * state.diureticMultiplier).toFixed(1)} ml/min`}
          color="text-purple-400"
        />

        {/* Flow */}
        <StatItem
          label="FLOW"
          value={`${state.urethralFlow.toFixed(1)} ml/s`}
          color={state.urethralFlow > 0 ? 'text-blue-400' : 'text-gray-500'}
        />

        {/* Training */}
        <StatItem
          label="TRAIN"
          value={`Lv.${state.trainingLevel} | Desens: ${state.desensitizationLevel.toFixed(0)}%`}
          color="text-teal-400"
        />
      </div>
    </div>
  );
}

function StatItem({ label, value, color, bar, barColor }: {
  label: string;
  value: string;
  color: string;
  bar?: number;
  barColor?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 text-[10px] uppercase tracking-wider">{label}</span>
      <span className={`${color} font-bold`}>{value}</span>
      {bar !== undefined && (
        <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${barColor || 'bg-gray-500'}`}
            style={{ width: `${Math.min(100, bar)}%` }}
          />
        </div>
      )}
    </div>
  );
}
