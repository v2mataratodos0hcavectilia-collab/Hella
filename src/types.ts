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
  trainingSpeedMultiplier: number; // 1-30 (speed of bladder training)
  
  // Traits
  fullBladderPreference: boolean; // likes full bladder, anxious when empty
  
  // Social media
  socialMediaPosts: SocialMediaPost[];
  isLiveStreaming: boolean;
  liveViewerCount: number;
  liveStartTime: number;
}

export interface SocialMediaPost {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
  isLive?: boolean;
  isFromUser?: boolean;
  replyTo?: string;
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

export type FluidType = 'water' | 'coffee' | 'tea' | 'alcohol' | 'soda' | 'energy_drink' | 'juice' | 'milk' | 'smoothie' | 'hot_chocolate';

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
  energy_drink: { fillMultiplier: 1.6, urgeMultiplier: 1.4, volumeMultiplier: 1, suppressesUrge: false, carbonationPressure: true },
  juice: { fillMultiplier: 1.1, urgeMultiplier: 1, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
  milk: { fillMultiplier: 0.9, urgeMultiplier: 0.9, volumeMultiplier: 1.2, suppressesUrge: false, carbonationPressure: false },
  smoothie: { fillMultiplier: 1.0, urgeMultiplier: 1, volumeMultiplier: 1.3, suppressesUrge: false, carbonationPressure: false },
  hot_chocolate: { fillMultiplier: 1.1, urgeMultiplier: 1.1, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
};

export const TIME_SPEEDS = [1, 5, 15, 30, 40, 60, 120];
