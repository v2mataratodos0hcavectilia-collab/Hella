export interface SimulationState {
  // Time
  simTime: number; // seconds of simulation time
  timeSpeed: number; // multiplier (1, 5, 15, 30, 40, 60, 120)
  isPaused: boolean;
  dayNumber: number;

  // Bladder
  bladderVolume: number; // ml
  maxCapacity: number; // ml (starts at 500, can train to 800)
  fillRate: number; // ml/min base rate
  bladderPressure: number; // cmH₂O

  // Sphincter
  sphincterFatigue: number; // 0-100%
  sphincterLocked: boolean;
  sphincterTrembling: boolean;

  // Urge
  urgeSignal: number; // 0-120%
  nerveSensitivity: number; // 0-100%
  falseAlarm: boolean;

  // Urethra
  urethralFlow: number; // ml/s
  urethralValveState: 'closed' | 'drip' | 'leak' | 'release';

  // AI State
  aiState: AIState;
  distractionLevel: number; // 0-100%
  cognitiveState: 'relaxed' | 'focused' | 'distracted' | 'desperate' | 'sleeping';

  // Environment
  temperature: number; // °F
  wardrobe: WardrobeType;
  posture: Posture;
  location: LocationType;

  // Vitals
  heartRate: number; // BPM
  breathingRate: number; // BrPM

  // Sleep
  isSleeping: boolean;
  sleepWakeSignalDisabled: boolean;

  // Fluid intake tracking
  lastDrinkType: FluidType | null;
  lastDrinkTime: number;
  diureticMultiplier: number;

  // Wardrobe
  undressingProgress: number; // 0-100
  isUndressing: boolean;
  canAccessBathroom: boolean;

  // Training
  trainingLevel: number; // 0-5
  desensitizationLevel: number; // 0-100%
}

export type AIState = 
  | 'idle'
  | 'walking'
  | 'sitting'
  | 'drinking'
  | 'holding'
  | 'pacing'
  | 'crossing_legs'
  | 'shifting_weight'
  | 'searching_bathroom'
  | 'undressing'
  | 'voiding'
  | 'sleeping'
  | 'working'
  | 'in_meeting'
  | 'gaming'
  | 'commuting';

export type FluidType = 'water' | 'coffee' | 'tea' | 'alcohol' | 'soda';

export type WardrobeType = 'skirt' | 'dress' | 'leggings' | 'jeans' | 'overalls' | 'jumpsuit';

export type Posture = 'standing' | 'sitting' | 'walking' | 'running' | 'lying_down';

export type LocationType = 'home' | 'office' | 'car' | 'bathroom' | 'bedroom' | 'kitchen' | 'meeting_room' | 'elevator';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  initialOverrides: Partial<SimulationState>;
}

export const WARDROBE_TIMES: Record<WardrobeType, number> = {
  skirt: 2,
  dress: 2,
  leggings: 2,
  jeans: 5,
  overalls: 15,
  jumpsuit: 15,
};

export const FLUID_PROPERTIES: Record<FluidType, { fillMultiplier: number; urgeMultiplier: number; volumeMultiplier: number; suppressesUrge: boolean; carbonationPressure: boolean }> = {
  water: { fillMultiplier: 1, urgeMultiplier: 1, volumeMultiplier: 1, suppressesUrge: false, carbonationPressure: false },
  coffee: { fillMultiplier: 1.5, urgeMultiplier: 1.3, volumeMultiplier: 1, suppressesUrge: false, carbonationPressure: false },
  tea: { fillMultiplier: 1.5, urgeMultiplier: 1.2, volumeMultiplier: 1, suppressesUrge: false, carbonationPressure: false },
  alcohol: { fillMultiplier: 1.8, urgeMultiplier: 0.5, volumeMultiplier: 1.5, suppressesUrge: true, carbonationPressure: false },
  soda: { fillMultiplier: 1.2, urgeMultiplier: 1.1, volumeMultiplier: 1, suppressesUrge: false, carbonationPressure: true },
};

export const TIME_SPEEDS = [1, 5, 15, 30, 40, 60, 120];
