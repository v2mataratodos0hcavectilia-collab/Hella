import { useState } from 'react';
import { SimulationState } from '../types';

interface AILogProps {
  state: SimulationState;
}

export default function AILog({ state }: AILogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const events = generateEvents(state);

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg font-mono text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1.5 flex items-center justify-between text-gray-500 text-[10px] uppercase tracking-wider hover:bg-gray-800/50 rounded-lg"
      >
        <span>AI Behavior Log</span>
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && (
        <div className="px-2 pb-2 max-h-32 overflow-y-auto">
          {events.map((event, i) => (
            <div key={i} className={`py-0.5 ${event.urgent ? 'text-red-400' : event.warning ? 'text-yellow-400' : 'text-gray-400'}`}>
              <span className="text-gray-600">[{event.time}]</span> {event.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function generateEvents(state: SimulationState): Array<{ time: string; message: string; urgent?: boolean; warning?: boolean }> {
  const events: Array<{ time: string; message: string; urgent?: boolean; warning?: boolean }> = [];
  const time = formatTime(state.simTime);

  // Current state
  events.push({
    time,
    message: `AI State: ${state.aiState.replace('_', ' ')} | Location: ${state.location.replace('_', ' ')}`,
  });

  // Bladder status
  const fillPercent = (state.bladderVolume / state.maxCapacity) * 100;
  if (fillPercent > 100) {
    events.push({
      time,
      message: `⚠ BLADDER OVER CAPACITY: ${state.bladderVolume.toFixed(0)}ml / ${state.maxCapacity.toFixed(0)}ml max`,
      urgent: true,
    });
  } else if (fillPercent > 80) {
    events.push({
      time,
      message: `Bladder near capacity: ${fillPercent.toFixed(0)}% full`,
      warning: true,
    });
  }

  // Urge status
  if (state.urgeSignal > 100) {
    events.push({
      time,
      message: `🔥 BLINDING URGE: ${state.urgeSignal.toFixed(0)}% — She cannot think straight`,
      urgent: true,
    });
  } else if (state.urgeSignal > 70) {
    events.push({
      time,
      message: `Strong urge detected: ${state.urgeSignal.toFixed(0)}%`,
      warning: true,
    });
  }

  // Sphincter status
  if (state.sphincterTrembling) {
    events.push({
      time,
      message: `💀 Sphincter trembling — fatigue at ${state.sphincterFatigue.toFixed(0)}%`,
      urgent: true,
    });
  } else if (state.sphincterLocked) {
    events.push({
      time,
      message: `Sphincter locked — she cannot voluntarily release`,
      warning: true,
    });
  }

  // Posture effects
  if (state.posture === 'sitting') {
    events.push({
      time,
      message: `Sitting — pressure on bladder +10%`,
    });
  } else if (state.posture === 'walking' || state.posture === 'running') {
    events.push({
      time,
      message: `${state.posture} — micro-bounce pressure spikes`,
    });
  }

  // Temperature effects
  if (state.temperature < 60) {
    events.push({
      time,
      message: `❄ Cold diuresis active — kidneys filtering faster`,
      warning: true,
    });
  } else if (state.temperature > 100) {
    events.push({
      time,
      message: `🔥 Hot environment — sphincter relaxation -50%`,
      warning: true,
    });
  }

  // Sleep
  if (state.isSleeping) {
    events.push({
      time,
      message: state.sleepWakeSignalDisabled 
        ? `💤 Sleeping — wake signal DISABLED (bladder still filling)`
        : `💤 Sleeping — sphincter holds indefinitely`,
    });
  }

  // Distraction
  if (state.distractionLevel > 70) {
    events.push({
      time,
      message: `High distraction (${state.distractionLevel.toFixed(0)}%) — urge suppressed`,
    });
  } else if (state.distractionLevel < 20) {
    events.push({
      time,
      message: `Low distraction — hyper-aware of bladder`,
      warning: true,
    });
  }

  // Training
  if (state.trainingLevel > 0) {
    events.push({
      time,
      message: `Training Lv.${state.trainingLevel} — Max capacity: ${state.maxCapacity.toFixed(0)}ml | Nerves: ${state.nerveSensitivity.toFixed(0)}%`,
    });
  }

  return events.slice(0, 8);
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600) % 24;
  const m = Math.floor((seconds % 3600) / 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
