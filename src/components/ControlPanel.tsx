import { SimulationState, FluidType, WardrobeType, Posture, LocationType, TIME_SPEEDS, DrugType, DRUG_PROPERTIES } from '../types';

interface PlayerOverrides {
  urgeSignal: boolean;
  distractionLevel: boolean;
  location: boolean;
  posture: boolean;
  temperature: boolean;
  fillRate: boolean;
}

interface ControlPanelProps {
  state: SimulationState;
  overrides: PlayerOverrides;
  setUrgeSignal: (v: number) => void;
  setFalseAlarm: (v: boolean) => void;
  setSphincterLock: (v: boolean) => void;
  setUrethralValve: (v: 'closed' | 'drip' | 'leak' | 'release') => void;
  setFillRate: (v: number) => void;
  setTimeSpeed: (v: number) => void;
  togglePause: () => void;
  resetSimulation: () => void;
  setTemperature: (v: number) => void;
  setWardrobe: (v: WardrobeType) => void;
  setPosture: (v: Posture) => void;
  setLocation: (v: LocationType) => void;
  setDistraction: (v: number) => void;
  setSleepWakeSignal: (v: boolean) => void;
  manualReset: () => void;
  giveDrink: (type: FluidType) => void;
  giveDrug: (type: DrugType) => void;
  setTrainingSpeed: (v: number) => void;
  toggleFullBladderPreference: () => void;
}

export default function ControlPanel({
  state,
  overrides,
  setUrgeSignal,
  setFalseAlarm,
  setSphincterLock,
  setUrethralValve,
  setFillRate,
  setTimeSpeed,
  togglePause,
  resetSimulation,
  setTemperature,
  setWardrobe,
  setPosture,
  setLocation,
  setDistraction,
  setSleepWakeSignal,
  manualReset,
  giveDrink,
  giveDrug,
  setTrainingSpeed,
  toggleFullBladderPreference,
}: ControlPanelProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-900/95 border-l border-gray-700 p-3 space-y-4 text-sm font-mono">
      {/* Time Controls */}
      <Section title="⏱ TIME CONTROL">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={togglePause}
            className={`px-3 py-1 rounded text-xs font-bold ${state.isPaused ? 'bg-green-600 hover:bg-green-500' : 'bg-yellow-600 hover:bg-yellow-500'} text-white`}
          >
            {state.isPaused ? '▶ PLAY' : '⏸ PAUSE'}
          </button>
          <span className="text-gray-400 text-xs">
            {formatTime(state.simTime)} | Day {state.dayNumber}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {TIME_SPEEDS.map(speed => (
            <button
              key={speed}
              onClick={() => setTimeSpeed(speed)}
              className={`px-2 py-1 rounded text-xs ${state.timeSpeed === speed ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {speed}×
            </button>
          ))}
        </div>
      </Section>

      {/* Urge Signal Override */}
      <Section title="🧠 URGE SIGNAL OVERRIDE" locked={overrides.urgeSignal}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="120"
              value={state.urgeSignal}
              onChange={(e) => setUrgeSignal(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <span className={`text-xs w-12 text-right ${state.urgeSignal > 100 ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
              {state.urgeSignal.toFixed(0)}%
            </span>
          </div>
          <button
            onClick={() => setFalseAlarm(!state.falseAlarm)}
            className={`w-full px-2 py-1 rounded text-xs ${state.falseAlarm ? 'bg-red-700 text-white animate-pulse' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {state.falseAlarm ? '⚡ FALSE ALARM ACTIVE' : '⚡ Trigger False Alarm (0% volume)'}
          </button>
        </div>
      </Section>

      {/* Sphincter Control */}
      <Section title="💪 SPHINCTER CONTROL">
        <div className="space-y-2">
          <button
            onClick={() => setSphincterLock(!state.sphincterLocked)}
            className={`w-full px-2 py-1 rounded text-xs ${state.sphincterLocked ? 'bg-orange-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {state.sphincterLocked ? '🔒 LOCKED (Cannot Release)' : '🔓 UNLOCKED'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Fatigue:</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${state.sphincterFatigue > 70 ? 'bg-red-500' : state.sphincterFatigue > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${state.sphincterFatigue}%` }}
              />
            </div>
            <span className="text-xs text-gray-300 w-10 text-right">{state.sphincterFatigue.toFixed(0)}%</span>
          </div>
          {state.sphincterTrembling && (
            <div className="text-xs text-red-400 animate-pulse">⚠ SPHINCTER TREMBLING</div>
          )}
        </div>
      </Section>

      {/* Urethral Valve */}
      <Section title="🚿 URETHRAL VALVE">
        <div className="grid grid-cols-4 gap-1">
          {(['closed', 'drip', 'leak', 'release'] as const).map(valve => (
            <button
              key={valve}
              onClick={() => setUrethralValve(valve)}
              className={`px-1 py-1.5 rounded text-xs ${state.urethralValveState === valve ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {valve === 'closed' ? '🚫' : valve === 'drip' ? '💧' : valve === 'leak' ? '🌊' : '💦'}
              <br />{valve}
            </button>
          ))}
        </div>
        {state.urethralFlow > 0 && (
          <div className="text-xs text-blue-300 mt-1">
            Flow: {state.urethralFlow.toFixed(1)} ml/s
          </div>
        )}
      </Section>

      {/* Fill Rate */}
      <Section title="🫘 KIDNEY FILL RATE" locked={overrides.fillRate}>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={state.fillRate}
            onChange={(e) => setFillRate(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-xs text-gray-300 w-16 text-right">{state.fillRate.toFixed(1)} ml/min</span>
        </div>
      </Section>

      {/* Fluid Intake */}
      <Section title="🥤 FLUID INTAKE">
        <div className="grid grid-cols-7 gap-1">
          {(['water', 'coffee', 'tea', 'alcohol', 'soda', 'energy_drink', 'juice', 'milk', 'smoothie', 'hot_chocolate', 'iced_coffee', 'sports_drink', 'coconut_water', 'herbal_tea'] as const).map(type => (
            <button
              key={type}
              onClick={() => giveDrink(type)}
              className="px-1 py-1.5 rounded text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 capitalize"
            >
              {type === 'water' ? '💧' : type === 'coffee' ? '☕' : type === 'tea' ? '🍵' : type === 'alcohol' ? '🍺' : type === 'soda' ? '🥤' : type === 'energy_drink' ? '⚡' : type === 'juice' ? '🧃' : type === 'milk' ? '🥛' : type === 'smoothie' ? '🥤' : type === 'hot_chocolate' ? '🍫' : type === 'iced_coffee' ? '🧊' : type === 'sports_drink' ? '🏃' : type === 'coconut_water' ? '🥥' : '🌿'}
              <br />{type.replace('_', ' ').substring(0, 6)}
            </button>
          ))}
        </div>
        {state.lastDrinkType && (
          <div className="text-xs text-gray-400 mt-1">
            Last: {state.lastDrinkType.replace('_', ' ')} ({state.diureticMultiplier.toFixed(1)}× fill)
          </div>
        )}
      </Section>

      {/* Drugs */}
      <Section title="💊 DRUGS">
        <div className="grid grid-cols-5 gap-1">
          {(['caffeine', 'adderall', 'xanax', 'oxycontin', 'mdma', 'lsd', 'nicotine', 'blazex', 'serenol'] as const).map(type => {
            const props = DRUG_PROPERTIES[type];
            const doses = state.drugDoses[type] || 0;
            const isActive = state.activeDrugs.some(d => d.type === type);
            return (
              <button
                key={type}
                onClick={() => giveDrug(type)}
                className={`px-1 py-1.5 rounded text-xs ${
                  isActive 
                    ? 'bg-green-700 text-white' 
                    : doses >= props.overdoseThreshold
                    ? 'bg-red-900 text-red-300'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title={`${props.name}\n${props.category}\n${props.description}\n${props.addictive ? '⚠️ ADDICTIVE' : ''}\n${props.overdoseRisk ? `⚠️ OVERDOSE: ${props.overdoseThreshold}+ doses` : ''}`}
              >
                {type === 'caffeine' ? '☕' : type === 'adderall' ? '💊' : type === 'xanax' ? '💊' : type === 'oxycontin' ? '💊' : type === 'mdma' ? '🎭' : type === 'lsd' ? '🍄' : type === 'nicotine' ? '🚬' : type === 'blazex' ? '💧' : '😌'}
                <br />{props.name.substring(0, 6)}
                {doses > 0 && <div className="text-[9px] mt-0.5">×{doses}</div>}
              </button>
            );
          })}
        </div>
        {state.activeDrugs.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="text-[10px] text-gray-500">Active:</div>
            {state.activeDrugs.slice(0, 3).map((drug, i) => {
              const props = DRUG_PROPERTIES[drug.type];
              const remaining = Math.max(0, drug.duration - (state.simTime - drug.startTime));
              const minutes = Math.floor(remaining / 60);
              return (
                <div key={i} className="text-[10px] text-green-400">
                  {props.name} ({minutes}m left)
                </div>
              );
            })}
          </div>
        )}
        {state.isOverdosing && (
          <div className="mt-2 text-xs text-red-400 bg-red-900/30 p-2 rounded animate-pulse">
            ⚠️ OVERDOSE: {state.overdoseDrug ? DRUG_PROPERTIES[state.overdoseDrug].name : 'Unknown'}
            <div className="text-[10px] mt-1">
              {state.overdoseDrug && DRUG_PROPERTIES[state.overdoseDrug].overdoseSymptoms}
            </div>
          </div>
        )}
      </Section>

      {/* Environment */}
      <Section title="🌡 ENVIRONMENT" locked={overrides.temperature || overrides.posture || overrides.location}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Temp{overrides.temperature && ' 🔒'}:</span>
            <input
              type="range"
              min="30"
              max="120"
              value={state.temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <span className="text-xs text-gray-300 w-20 text-right">
              {state.temperature}°F ({((state.temperature - 32) * 5/9).toFixed(0)}°C)
            </span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] text-gray-500">Posture{overrides.posture && ' 🔒'}:</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(['standing', 'sitting', 'walking', 'running', 'lying_down'] as Posture[]).map(p => (
              <button
                key={p}
                onClick={() => setPosture(p)}
                className={`px-1 py-1 rounded text-xs ${state.posture === p ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {p.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 mb-1 mt-2">
            <span className="text-[10px] text-gray-500">Location{overrides.location && ' 🔒'}:</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(['home', 'office', 'car', 'bathroom', 'bedroom', 'kitchen', 'meeting_room', 'elevator'] as LocationType[]).map(loc => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`px-1 py-1 rounded text-xs ${state.location === loc ? 'bg-indigo-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {loc.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Wardrobe */}
      <Section title="👗 WARDROBE">
        <div className="grid grid-cols-3 gap-1">
          {(['skirt', 'dress', 'leggings', 'jeans', 'overalls', 'jumpsuit'] as WardrobeType[]).map(w => (
            <button
              key={w}
              onClick={() => setWardrobe(w)}
              className={`px-1 py-1 rounded text-xs capitalize ${state.wardrobe === w ? 'bg-pink-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {w}
            </button>
          ))}
        </div>
      </Section>

      {/* Cognitive */}
      <Section title="🧩 COGNITIVE STATE" locked={overrides.distractionLevel}>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Distraction:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={state.distractionLevel}
            onChange={(e) => setDistraction(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-xs text-gray-300 w-10 text-right">{state.distractionLevel.toFixed(0)}%</span>
        </div>
      </Section>

      {/* Sleep */}
      <Section title="😴 SLEEP CONTROL">
        <button
          onClick={() => setSleepWakeSignal(!state.sleepWakeSignalDisabled)}
          className={`w-full px-2 py-1 rounded text-xs ${state.sleepWakeSignalDisabled ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {state.sleepWakeSignalDisabled ? '🌙 Wake Signal DISABLED' : '☀️ Wake Signal Active'}
        </button>
        {state.isSleeping && (
          <div className="text-xs text-purple-300 mt-1">💤 She is sleeping...</div>
        )}
      </Section>

      {/* Reset */}
      <Section title="🔄 RESET">
        <div className="flex gap-2">
          <button
            onClick={manualReset}
            className="flex-1 px-2 py-1.5 rounded text-xs bg-teal-700 text-white hover:bg-teal-600"
          >
            Manual Reset (Bladder)
          </button>
          <button
            onClick={resetSimulation}
            className="flex-1 px-2 py-1.5 rounded text-xs bg-red-800 text-white hover:bg-red-700"
          >
            Full Reset
          </button>
        </div>
      </Section>

      {/* Bladder Training Speed */}
      <Section title="⚡ TRAINING SPEED">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max="100"
            value={state.trainingSpeedMultiplier}
            onChange={(e) => setTrainingSpeed(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-xs text-gray-300 w-10 text-right">{state.trainingSpeedMultiplier}×</span>
        </div>
        <div className="text-[10px] text-gray-500 mt-1">
          1× = normal | 100× = maximum speed
        </div>
      </Section>

      {/* Traits */}
      <Section title="✨ TRAITS">
        <button
          onClick={toggleFullBladderPreference}
          className={`w-full px-2 py-2 rounded text-xs ${
            state.fullBladderPreference 
              ? 'bg-purple-700 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {state.fullBladderPreference ? (
            <>
              <div className="font-bold">🔮 Full Bladder Preference: ON</div>
              <div className="text-[10px] mt-1 opacity-80">Likes full bladder, anxious when empty</div>
            </>
          ) : (
            <>
              <div className="font-bold">🔮 Full Bladder Preference: OFF</div>
              <div className="text-[10px] mt-1 opacity-80">Click to enable trait</div>
            </>
          )}
        </button>
      </Section>
    </div>
  );
}

function Section({ title, children, locked }: { title: string; children: React.ReactNode; locked?: boolean }) {
  return (
    <div className={`border rounded-lg p-2 ${locked ? 'border-amber-700/60 bg-amber-900/10' : 'border-gray-700 bg-gray-800/50'}`}>
      <h3 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider flex items-center gap-1">
        {title}
        {locked && <span className="text-[10px] text-amber-400 font-normal normal-case">🔒 manual</span>}
      </h3>
      {children}
    </div>
  );
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600) % 24;
  const m = Math.floor((seconds % 3600) / 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
