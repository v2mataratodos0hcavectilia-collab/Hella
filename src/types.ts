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
  activeSocialTab: 'live' | 'posts' | 'recommendations' | 'explore';
  
  // Drugs
  activeDrugs: ActiveDrug[];
  drugDoses: Record<DrugType, number>;
  isOverdosing: boolean;
  overdoseDrug: DrugType | null;
}

export interface ActiveDrug {
  type: DrugType;
  startTime: number;
  duration: number;
  dose: number;
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

export type FluidType = 'water' | 'coffee' | 'tea' | 'alcohol' | 'soda' | 'energy_drink' | 'juice' | 'milk' | 'smoothie' | 'hot_chocolate' | 'iced_coffee' | 'sports_drink' | 'coconut_water' | 'herbal_tea';

export type DrugType = 'caffeine' | 'adderall' | 'xanax' | 'oxycontin' | 'mdma' | 'lsd' | 'nicotine' | 'blazex' | 'serenol' | 'valium' | 'morphine' | 'ketamine' | 'ritalin';

export interface DrugEffect {
  name: string;
  category: string;
  fillMultiplier: number;
  urgeMultiplier: number;
  heartRateBonus: number;
  breathingBonus: number;
  sphincterRelaxation: number; // 0-1
  suppressesUrge: boolean;
  addictive: boolean;
  overdoseRisk: boolean;
  overdoseThreshold: number; // doses before overdose
  duration: number; // sim seconds
  description: string;
  overdoseSymptoms?: string;
}

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
  iced_coffee: { fillMultiplier: 1.7, urgeMultiplier: 1.4, volumeMultiplier: 1.2, suppressesUrge: false, carbonationPressure: false },
  sports_drink: { fillMultiplier: 0.8, urgeMultiplier: 0.9, volumeMultiplier: 1, suppressesUrge: false, carbonationPressure: false },
  coconut_water: { fillMultiplier: 1.3, urgeMultiplier: 1, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
  herbal_tea: { fillMultiplier: 0.7, urgeMultiplier: 0.6, volumeMultiplier: 1, suppressesUrge: false, carbonationPressure: false },
};

export const DRUG_PROPERTIES: Record<DrugType, DrugEffect> = {
  caffeine: {
    name: 'Caffeine',
    category: 'Stimulant',
    fillMultiplier: 1.4,
    urgeMultiplier: 1.3,
    heartRateBonus: 15,
    breathingBonus: 3,
    sphincterRelaxation: 0,
    suppressesUrge: false,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 5,
    duration: 1800,
    description: 'Common stimulant. Increases alertness and bladder activity.',
    overdoseSymptoms: 'Rapid heartbeat, tremors, anxiety',
  },
  adderall: {
    name: 'Adderall',
    category: 'Stimulant',
    fillMultiplier: 1.2,
    urgeMultiplier: 0.3,
    heartRateBonus: 25,
    breathingBonus: 5,
    sphincterRelaxation: 0.1,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 3,
    duration: 3600,
    description: 'Prescription stimulant. Suppresses bladder awareness significantly.',
    overdoseSymptoms: 'Chest pain, hallucinations, severe hypertension',
  },
  xanax: {
    name: 'Xanax',
    category: 'Benzodiazepine',
    fillMultiplier: 0.8,
    urgeMultiplier: 0.2,
    heartRateBonus: -10,
    breathingBonus: -3,
    sphincterRelaxation: 0.4,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 4,
    duration: 2400,
    description: 'Anti-anxiety medication. Relaxes sphincter and suppresses urge.',
    overdoseSymptoms: 'Extreme drowsiness, confusion, respiratory depression',
  },
  oxycontin: {
    name: 'OxyContin',
    category: 'Opioid',
    fillMultiplier: 0.6,
    urgeMultiplier: 0.1,
    heartRateBonus: -15,
    breathingBonus: -5,
    sphincterRelaxation: 0.5,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 3,
    duration: 4800,
    description: 'Strong painkiller. Severely reduces all bodily awareness.',
    overdoseSymptoms: 'Respiratory failure, unconsciousness, death',
  },
  mdma: {
    name: 'MDMA',
    category: 'Empathogen',
    fillMultiplier: 1.0,
    urgeMultiplier: 0.4,
    heartRateBonus: 30,
    breathingBonus: 6,
    sphincterRelaxation: 0.2,
    suppressesUrge: true,
    addictive: false,
    overdoseRisk: true,
    overdoseThreshold: 4,
    duration: 3600,
    description: 'Causes dehydration and overheating. Suppresses bladder signals.',
    overdoseSymptoms: 'Hyperthermia, seizures, organ failure',
  },
  lsd: {
    name: 'LSD',
    category: 'Hallucinogen',
    fillMultiplier: 0.9,
    urgeMultiplier: 0.5,
    heartRateBonus: 10,
    breathingBonus: 2,
    sphincterRelaxation: 0.1,
    suppressesUrge: false,
    addictive: false,
    overdoseRisk: false,
    overdoseThreshold: 999,
    duration: 7200,
    description: 'Alters perception of time. Bladder sensations feel distant.',
  },
  nicotine: {
    name: 'Nicotine',
    category: 'Stimulant',
    fillMultiplier: 1.1,
    urgeMultiplier: 1.1,
    heartRateBonus: 8,
    breathingBonus: 1,
    sphincterRelaxation: 0,
    suppressesUrge: false,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 8,
    duration: 900,
    description: 'Mild stimulant. Slightly increases bladder activity.',
    overdoseSymptoms: 'Nausea, dizziness, rapid heartbeat',
  },
  blazex: {
    name: 'Blazex',
    category: 'Diuretic',
    fillMultiplier: 3.0,
    urgeMultiplier: 2.0,
    heartRateBonus: 5,
    breathingBonus: 1,
    sphincterRelaxation: 0,
    suppressesUrge: false,
    addictive: false,
    overdoseRisk: false,
    overdoseThreshold: 999,
    duration: 2400,
    description: 'Experimental diuretic. Extreme bladder fill rate.',
  },
  serenol: {
    name: 'Serenol',
    category: 'Relaxant',
    fillMultiplier: 0.7,
    urgeMultiplier: 0.3,
    heartRateBonus: -8,
    breathingBonus: -2,
    sphincterRelaxation: 0.3,
    suppressesUrge: true,
    addictive: false,
    overdoseRisk: true,
    overdoseThreshold: 6,
    duration: 3000,
    description: 'Muscle relaxant. Reduces sphincter tension and urge awareness.',
    overdoseSymptoms: 'Extreme muscle weakness, difficulty breathing',
  },
  valium: {
    name: 'Valium',
    category: 'Benzodiazepine',
    fillMultiplier: 0.75,
    urgeMultiplier: 0.25,
    heartRateBonus: -12,
    breathingBonus: -4,
    sphincterRelaxation: 0.45,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 5,
    duration: 3600,
    description: 'Anti-anxiety medication. Strong sphincter relaxation.',
    overdoseSymptoms: 'Severe drowsiness, confusion, respiratory depression',
  },
  morphine: {
    name: 'Morphine',
    category: 'Opioid',
    fillMultiplier: 0.5,
    urgeMultiplier: 0.05,
    heartRateBonus: -20,
    breathingBonus: -6,
    sphincterRelaxation: 0.6,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 2,
    duration: 5400,
    description: 'Powerful painkiller. Near-total bladder awareness suppression.',
    overdoseSymptoms: 'Respiratory arrest, coma, death',
  },
  ketamine: {
    name: 'Ketamine',
    category: 'Dissociative',
    fillMultiplier: 0.85,
    urgeMultiplier: 0.15,
    heartRateBonus: 15,
    breathingBonus: 2,
    sphincterRelaxation: 0.35,
    suppressesUrge: true,
    addictive: false,
    overdoseRisk: true,
    overdoseThreshold: 4,
    duration: 2400,
    description: 'Dissociative anesthetic. Detaches from bodily sensations.',
    overdoseSymptoms: 'Loss of consciousness, respiratory failure',
  },
  ritalin: {
    name: 'Ritalin',
    category: 'Stimulant',
    fillMultiplier: 1.3,
    urgeMultiplier: 0.4,
    heartRateBonus: 20,
    breathingBonus: 4,
    sphincterRelaxation: 0.05,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 4,
    duration: 2700,
    description: 'ADHD medication. Suppresses urge while increasing heart rate.',
    overdoseSymptoms: 'Agitation, hallucinations, cardiac arrest',
  },
};

export const TIME_SPEEDS = [1, 5, 15, 30, 40, 60, 120, 150];
