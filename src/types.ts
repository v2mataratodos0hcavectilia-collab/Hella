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
  bloodPressure: number; // mmHg (systolic)
  bloodO2Level: number; // 0-100% (oxygen saturation)

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
  activeSocialTab: 'live' | 'posts' | 'recommendations' | 'explore' | 'personal' | 'chat';
  playerAccount: PlayerAccount;
  chatMessages: ChatMessage[];
  viewedProfile: string | null;
  
  // Drugs
  activeDrugs: ActiveDrug[];
  drugDoses: Record<DrugType, number>;
  isOverdosing: boolean;
  overdoseDrug: DrugType | null;
  
  // Economy
  money: number;
  totalEarned: number;
  lastIncomeTime: number;
  
  // Achievements
  unlockedAchievements: string[];
  achievementProgress: Record<string, number>;
  
  // Enhanced social
  followerSuggestions: FollowerSuggestion[];
  liveDonations: Donation[];
  postComments: Record<string, SocialMediaComment[]>;
  
  // Achievement tracking
  lastVoidTime: number;
  totalStreams: number;
  followerCount: number;
  totalDrugsTaken: number;
  drugsTried: DrugType[];
  overdosesSurvived: number;
  
  // Death/pass out mechanics
  isPassedOut: boolean;
  passOutTime: number;
  isDead: boolean;
  deathCause: string;
  consciousnessLevel: number; // 0-100%
  deathCountdown: number; // seconds until death (0 = dead)
  isDying: boolean; // in critical condition but not yet dead
  
  // Nanobot control
  nanobotsActive: boolean;
  playerHeartRateControl: number | null; // null = auto, number = manual BPM
  playerBreathingControl: number | null; // null = auto, number = manual BrPM
  heartBeatStrength: number; // 0-100% (how strong each heartbeat is)
  breathDeepness: number; // 0-100% (how deep each breath is)
  
  // Weather & Time System
  weather: WeatherType;
  season: SeasonType;
  timeOfDay: TimeOfDayType;
  weatherChangeTimer: number;
  
  // Relationships
  friends: Relationship[];
  family: Relationship[];
  romanticInterest: Relationship | null;
  rival: Relationship | null;
  
  // Stress & Food
  stressLevel: number; // 0-100%
  lastFoodEaten: FoodType | null;
  lastFoodTime: number;
  
  // Training Specialization
  trainingMethod: TrainingMethod;
  bladderControlMode: boolean;
  bladderControlLevel: number; // 0-100%
  trainingSpecializations: Record<TrainingScenario, number>;
  
  // Economic Depth
  investments: Investment[];
  debt: number;
  monthlyExpenses: number;
  careerLevel: number;
  lastExpenseTime: number;
  
  // Narrative
  memories: Memory[];
  personalityTraits: PersonalityTrait[];
  lifeGoals: LifeGoal[];
  
  // Multi-Character
  otherCharacters: OtherCharacter[];
  currentVisitors: string[];
  cameraViewMode: 'her' | 'others';
  
  // Custom Scenarios
  customScenarios: CustomScenario[];
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
  commentList?: SocialMediaComment[];
}

export interface SocialMediaComment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  isFromPlayer?: boolean;
}

export interface PlayerAccount {
  username: string;
  posts: SocialMediaPost[];
  comments: SocialMediaComment[];
  following: string[];
}

export interface FollowerSuggestion {
  id: string;
  follower: string;
  suggestion: string;
  timestamp: number;
  responded?: boolean;
  response?: string;
  responseTimestamp?: number;
}

export interface Donation {
  id: string;
  viewer: string;
  amount: number;
  message: string;
  timestamp: number;
  isMegaInfluencer?: boolean;
}

export interface ChatMessage {
  id: string;
  author: string;
  message: string;
  timestamp: number;
  isFromUser?: boolean;
}

// Weather & Time Types
export type WeatherType = 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'hot' | 'cold';
export type SeasonType = 'spring' | 'summer' | 'fall' | 'winter';
export type TimeOfDayType = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

// Relationship Types
export interface Relationship {
  id: string;
  name: string;
  type: 'friend' | 'family' | 'romantic' | 'rival';
  closeness: number; // 0-100
  lastInteraction: number;
  messages: RelationshipMessage[];
}

export interface RelationshipMessage {
  id: string;
  from: string;
  content: string;
  timestamp: number;
  isFromPlayer?: boolean;
}

// Food Types
export type FoodType = 
  // Breakfast
  | 'eggs' | 'bacon' | 'cereal' | 'oatmeal' | 'toast' | 'pancakes' | 'yogurt' | 'fruit'
  // Lunch/Dinner
  | 'sandwich' | 'salad' | 'pasta' | 'rice' | 'chicken' | 'fish' | 'steak' | 'soup'
  // Snacks
  | 'chips' | 'cookies' | 'nuts' | 'chocolate' | 'fruit_snack' | 'granola_bar'
  // Diuretic Foods
  | 'watermelon' | 'cucumber' | 'celery' | 'asparagus' | 'cranberries' | 'coffee_beans'
  // Spicy Foods
  | 'spicy_curry' | 'hot_wings' | 'jalapenos' | 'spicy_soup'
  // Healthy
  | 'vegetables' | 'lean_protein' | 'whole_grains' | 'berries';

export interface FoodEffect {
  name: string;
  category: string;
  fillMultiplier: number; // Effect on bladder fill rate
  urgeMultiplier: number; // Effect on urge signal
  stressEffect: number; // -10 to +10 (negative = calming, positive = stressful)
  healthEffect: number; // -10 to +10 (negative = unhealthy, positive = healthy)
  description: string;
}

export const FOOD_PROPERTIES: Record<FoodType, FoodEffect> = {
  // Breakfast
  eggs: { name: 'Eggs', category: 'Breakfast', fillMultiplier: 1.0, urgeMultiplier: 1.0, stressEffect: 0, healthEffect: 5, description: 'Protein-rich breakfast' },
  bacon: { name: 'Bacon', category: 'Breakfast', fillMultiplier: 1.1, urgeMultiplier: 1.0, stressEffect: 2, healthEffect: -3, description: 'Salty and fatty' },
  cereal: { name: 'Cereal', category: 'Breakfast', fillMultiplier: 1.2, urgeMultiplier: 1.0, stressEffect: 0, healthEffect: 2, description: 'Quick and easy' },
  oatmeal: { name: 'Oatmeal', category: 'Breakfast', fillMultiplier: 1.0, urgeMultiplier: 0.9, stressEffect: -2, healthEffect: 7, description: 'Filling and healthy' },
  toast: { name: 'Toast', category: 'Breakfast', fillMultiplier: 0.9, urgeMultiplier: 1.0, stressEffect: 0, healthEffect: 1, description: 'Simple carbs' },
  pancakes: { name: 'Pancakes', category: 'Breakfast', fillMultiplier: 1.3, urgeMultiplier: 1.1, stressEffect: -1, healthEffect: -2, description: 'Sweet and filling' },
  yogurt: { name: 'Yogurt', category: 'Breakfast', fillMultiplier: 1.1, urgeMultiplier: 1.0, stressEffect: -1, healthEffect: 6, description: 'Probiotic and light' },
  fruit: { name: 'Fruit', category: 'Breakfast', fillMultiplier: 1.0, urgeMultiplier: 0.9, stressEffect: -2, healthEffect: 8, description: 'Natural and healthy' },
  
  // Lunch/Dinner
  sandwich: { name: 'Sandwich', category: 'Lunch/Dinner', fillMultiplier: 1.1, urgeMultiplier: 1.0, stressEffect: 0, healthEffect: 2, description: 'Balanced meal' },
  salad: { name: 'Salad', category: 'Lunch/Dinner', fillMultiplier: 0.9, urgeMultiplier: 0.9, stressEffect: -2, healthEffect: 8, description: 'Light and healthy' },
  pasta: { name: 'Pasta', category: 'Lunch/Dinner', fillMultiplier: 1.3, urgeMultiplier: 1.1, stressEffect: -1, healthEffect: 0, description: 'Carb-heavy' },
  rice: { name: 'Rice', category: 'Lunch/Dinner', fillMultiplier: 1.2, urgeMultiplier: 1.0, stressEffect: 0, healthEffect: 2, description: 'Staple carb' },
  chicken: { name: 'Chicken', category: 'Lunch/Dinner', fillMultiplier: 1.0, urgeMultiplier: 1.0, stressEffect: 0, healthEffect: 6, description: 'Lean protein' },
  fish: { name: 'Fish', category: 'Lunch/Dinner', fillMultiplier: 1.0, urgeMultiplier: 1.0, stressEffect: -1, healthEffect: 7, description: 'Omega-3 rich' },
  steak: { name: 'Steak', category: 'Lunch/Dinner', fillMultiplier: 1.2, urgeMultiplier: 1.1, stressEffect: 1, healthEffect: 3, description: 'Heavy protein' },
  soup: { name: 'Soup', category: 'Lunch/Dinner', fillMultiplier: 1.4, urgeMultiplier: 1.2, stressEffect: -2, healthEffect: 4, description: 'Warm and hydrating' },
  
  // Snacks
  chips: { name: 'Chips', category: 'Snacks', fillMultiplier: 1.1, urgeMultiplier: 1.1, stressEffect: 2, healthEffect: -5, description: 'Salty and crunchy' },
  cookies: { name: 'Cookies', category: 'Snacks', fillMultiplier: 1.2, urgeMultiplier: 1.1, stressEffect: -2, healthEffect: -4, description: 'Sweet treat' },
  nuts: { name: 'Nuts', category: 'Snacks', fillMultiplier: 1.0, urgeMultiplier: 1.0, stressEffect: -1, healthEffect: 5, description: 'Healthy fats' },
  chocolate: { name: 'Chocolate', category: 'Snacks', fillMultiplier: 1.1, urgeMultiplier: 1.0, stressEffect: -3, healthEffect: -2, description: 'Mood booster' },
  fruit_snack: { name: 'Fruit Snack', category: 'Snacks', fillMultiplier: 1.0, urgeMultiplier: 0.9, stressEffect: -1, healthEffect: 4, description: 'Light and sweet' },
  granola_bar: { name: 'Granola Bar', category: 'Snacks', fillMultiplier: 1.1, urgeMultiplier: 1.0, stressEffect: 0, healthEffect: 3, description: 'Quick energy' },
  
  // Diuretic Foods
  watermelon: { name: 'Watermelon', category: 'Diuretic', fillMultiplier: 1.8, urgeMultiplier: 1.5, stressEffect: -1, healthEffect: 7, description: 'High water content' },
  cucumber: { name: 'Cucumber', category: 'Diuretic', fillMultiplier: 1.6, urgeMultiplier: 1.4, stressEffect: -2, healthEffect: 6, description: 'Very hydrating' },
  celery: { name: 'Celery', category: 'Diuretic', fillMultiplier: 1.5, urgeMultiplier: 1.3, stressEffect: -1, healthEffect: 5, description: 'Natural diuretic' },
  asparagus: { name: 'Asparagus', category: 'Diuretic', fillMultiplier: 1.7, urgeMultiplier: 1.6, stressEffect: 0, healthEffect: 6, description: 'Strong diuretic' },
  cranberries: { name: 'Cranberries', category: 'Diuretic', fillMultiplier: 1.6, urgeMultiplier: 1.5, stressEffect: 0, healthEffect: 7, description: 'Urinary tract health' },
  coffee_beans: { name: 'Coffee Beans', category: 'Diuretic', fillMultiplier: 1.9, urgeMultiplier: 1.7, stressEffect: 3, healthEffect: 2, description: 'Concentrated caffeine' },
  
  // Spicy Foods
  spicy_curry: { name: 'Spicy Curry', category: 'Spicy', fillMultiplier: 1.2, urgeMultiplier: 1.4, stressEffect: 5, healthEffect: 3, description: 'Very spicy' },
  hot_wings: { name: 'Hot Wings', category: 'Spicy', fillMultiplier: 1.1, urgeMultiplier: 1.3, stressEffect: 6, healthEffect: -2, description: 'Extremely hot' },
  jalapenos: { name: 'Jalapeños', category: 'Spicy', fillMultiplier: 1.1, urgeMultiplier: 1.2, stressEffect: 4, healthEffect: 2, description: 'Moderately spicy' },
  spicy_soup: { name: 'Spicy Soup', category: 'Spicy', fillMultiplier: 1.4, urgeMultiplier: 1.3, stressEffect: 4, healthEffect: 3, description: 'Hot and hydrating' },
  
  // Healthy
  vegetables: { name: 'Vegetables', category: 'Healthy', fillMultiplier: 1.0, urgeMultiplier: 0.9, stressEffect: -3, healthEffect: 9, description: 'Very healthy' },
  lean_protein: { name: 'Lean Protein', category: 'Healthy', fillMultiplier: 1.0, urgeMultiplier: 1.0, stressEffect: -1, healthEffect: 8, description: 'Muscle building' },
  whole_grains: { name: 'Whole Grains', category: 'Healthy', fillMultiplier: 1.1, urgeMultiplier: 1.0, stressEffect: -2, healthEffect: 7, description: 'Complex carbs' },
  berries: { name: 'Berries', category: 'Healthy', fillMultiplier: 1.0, urgeMultiplier: 0.9, stressEffect: -2, healthEffect: 9, description: 'Antioxidant rich' },
};

// Training Types
export type TrainingMethod = 'kegels' | 'meditation' | 'cold_exposure' | 'interval' | 'none';
export type TrainingScenario = 'sitting' | 'standing' | 'walking' | 'running' | 'sleeping' | 'social';

// Economic Types
export interface Investment {
  id: string;
  name: string;
  amount: number;
  returnRate: number; // % per day
  startTime: number;
  lastPayout: number;
}

// Narrative Types
export interface Memory {
  id: string;
  event: string;
  timestamp: number;
  emotionalImpact: number; // -100 to 100
  category: 'achievement' | 'embarrassing' | 'happy' | 'sad' | 'stressful';
}

export type PersonalityTrait = 'patient' | 'anxious' | 'competitive' | 'social' | 'introverted' | 'adventurous';

export interface LifeGoal {
  id: string;
  description: string;
  progress: number; // 0-100
  completed: boolean;
  category: 'bladder' | 'social' | 'career' | 'personal';
}

// Multi-Character Types
export interface OtherCharacter {
  id: string;
  name: string;
  bladderVolume: number;
  maxCapacity: number;
  location: LocationType;
  aiState: AIState;
  personality: string;
  bladderCapacity: number;
  isVisiting: boolean;
}

// Custom Scenario Types
export interface CustomScenario {
  id: string;
  name: string;
  description: string;
  initialOverrides: Partial<SimulationState>;
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

export type FluidType = 'water' | 'coffee' | 'tea' | 'alcohol' | 'soda' | 'energy_drink' | 'juice' | 'milk' | 'smoothie' | 'hot_chocolate' | 'iced_coffee' | 'sports_drink' | 'coconut_water' | 'herbal_tea' | 'lemonade' | 'apple_juice' | 'orange_juice' | 'cranberry_juice' | 'green_tea' | 'black_tea' | 'chai_tea' | 'espresso' | 'cappuccino' | 'mocha' | 'beer' | 'wine' | 'vodka' | 'whiskey' | 'champagne' | 'margarita' | 'bloody_mary' | 'matcha_latte' | 'kombucha' | 'bone_broth' | 'protein_shake' | 'cold_brew' | 'affogato' | 'irish_coffee' | 'pina_colada' | 'moscow_mule' | 'gin_tonic' | 'rum_coke' | 'tequila_sunrise' | 'bloody_mary';

export type DrugType = 'caffeine' | 'adderall' | 'xanax' | 'oxycontin' | 'mdma' | 'lsd' | 'nicotine' | 'blazex' | 'serenol' | 'valium' | 'morphine' | 'ketamine' | 'ritalin' | 'meth' | 'cocaine' | 'heroin' | 'fentanyl' | 'ecstasy' | 'mushrooms' | 'dmt' | 'pcp' | 'roxie' | 'percocet' | 'ambien' | 'nanobots';

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
  lemonade: { fillMultiplier: 1.0, urgeMultiplier: 1.0, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
  apple_juice: { fillMultiplier: 1.1, urgeMultiplier: 1.0, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
  orange_juice: { fillMultiplier: 1.1, urgeMultiplier: 1.0, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
  cranberry_juice: { fillMultiplier: 1.2, urgeMultiplier: 1.1, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
  green_tea: { fillMultiplier: 1.3, urgeMultiplier: 1.1, volumeMultiplier: 1.0, suppressesUrge: false, carbonationPressure: false },
  black_tea: { fillMultiplier: 1.4, urgeMultiplier: 1.2, volumeMultiplier: 1.0, suppressesUrge: false, carbonationPressure: false },
  chai_tea: { fillMultiplier: 1.3, urgeMultiplier: 1.1, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
  espresso: { fillMultiplier: 1.8, urgeMultiplier: 1.5, volumeMultiplier: 0.5, suppressesUrge: false, carbonationPressure: false },
  cappuccino: { fillMultiplier: 1.5, urgeMultiplier: 1.3, volumeMultiplier: 1.2, suppressesUrge: false, carbonationPressure: false },
  mocha: { fillMultiplier: 1.4, urgeMultiplier: 1.2, volumeMultiplier: 1.3, suppressesUrge: false, carbonationPressure: false },
  beer: { fillMultiplier: 1.6, urgeMultiplier: 0.6, volumeMultiplier: 1.4, suppressesUrge: true, carbonationPressure: true },
  wine: { fillMultiplier: 1.5, urgeMultiplier: 0.5, volumeMultiplier: 1.3, suppressesUrge: true, carbonationPressure: false },
  vodka: { fillMultiplier: 1.7, urgeMultiplier: 0.4, volumeMultiplier: 1.2, suppressesUrge: true, carbonationPressure: false },
  whiskey: { fillMultiplier: 1.8, urgeMultiplier: 0.4, volumeMultiplier: 1.2, suppressesUrge: true, carbonationPressure: false },
  champagne: { fillMultiplier: 1.6, urgeMultiplier: 0.5, volumeMultiplier: 1.3, suppressesUrge: true, carbonationPressure: true },
  margarita: { fillMultiplier: 1.7, urgeMultiplier: 0.4, volumeMultiplier: 1.3, suppressesUrge: true, carbonationPressure: false },
  bloody_mary: { fillMultiplier: 1.6, urgeMultiplier: 0.5, volumeMultiplier: 1.4, suppressesUrge: true, carbonationPressure: false },
  matcha_latte: { fillMultiplier: 1.4, urgeMultiplier: 1.2, volumeMultiplier: 1.2, suppressesUrge: false, carbonationPressure: false },
  kombucha: { fillMultiplier: 1.1, urgeMultiplier: 1.0, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: true },
  bone_broth: { fillMultiplier: 0.8, urgeMultiplier: 0.7, volumeMultiplier: 1.0, suppressesUrge: false, carbonationPressure: false },
  protein_shake: { fillMultiplier: 0.9, urgeMultiplier: 0.8, volumeMultiplier: 1.3, suppressesUrge: false, carbonationPressure: false },
  cold_brew: { fillMultiplier: 1.9, urgeMultiplier: 1.6, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
  affogato: { fillMultiplier: 1.3, urgeMultiplier: 1.1, volumeMultiplier: 1.1, suppressesUrge: false, carbonationPressure: false },
  irish_coffee: { fillMultiplier: 1.5, urgeMultiplier: 0.8, volumeMultiplier: 1.2, suppressesUrge: true, carbonationPressure: false },
  pina_colada: { fillMultiplier: 1.6, urgeMultiplier: 0.5, volumeMultiplier: 1.4, suppressesUrge: true, carbonationPressure: false },
  moscow_mule: { fillMultiplier: 1.7, urgeMultiplier: 0.4, volumeMultiplier: 1.3, suppressesUrge: true, carbonationPressure: true },
  gin_tonic: { fillMultiplier: 1.6, urgeMultiplier: 0.5, volumeMultiplier: 1.2, suppressesUrge: true, carbonationPressure: true },
  rum_coke: { fillMultiplier: 1.7, urgeMultiplier: 0.4, volumeMultiplier: 1.3, suppressesUrge: true, carbonationPressure: true },
  tequila_sunrise: { fillMultiplier: 1.6, urgeMultiplier: 0.5, volumeMultiplier: 1.3, suppressesUrge: true, carbonationPressure: false },
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
  meth: {
    name: 'Methamphetamine',
    category: 'Addictive',
    fillMultiplier: 0.9,
    urgeMultiplier: 0.2,
    heartRateBonus: 35,
    breathingBonus: 6,
    sphincterRelaxation: 0.15,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 3,
    duration: 4800,
    description: 'Powerful stimulant. Extreme heart rate, suppresses all bodily awareness.',
    overdoseSymptoms: 'Hyperthermia, organ failure, death',
  },
  cocaine: {
    name: 'Cocaine',
    category: 'Addictive',
    fillMultiplier: 1.1,
    urgeMultiplier: 0.3,
    heartRateBonus: 30,
    breathingBonus: 5,
    sphincterRelaxation: 0.1,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 4,
    duration: 1800,
    description: 'Short-acting stimulant. Intense but brief effects.',
    overdoseSymptoms: 'Cardiac arrest, stroke, seizures',
  },
  heroin: {
    name: 'Heroin',
    category: 'Addictive',
    fillMultiplier: 0.4,
    urgeMultiplier: 0.05,
    heartRateBonus: -25,
    breathingBonus: -8,
    sphincterRelaxation: 0.7,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 2,
    duration: 3600,
    description: 'Extremely addictive opioid. Near-total bodily suppression.',
    overdoseSymptoms: 'Respiratory arrest, coma, death',
  },
  fentanyl: {
    name: 'Fentanyl',
    category: 'Addictive',
    fillMultiplier: 0.3,
    urgeMultiplier: 0.02,
    heartRateBonus: -30,
    breathingBonus: -10,
    sphincterRelaxation: 0.8,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 1,
    duration: 2400,
    description: 'Synthetic opioid. Extremely dangerous even in small doses.',
    overdoseSymptoms: 'Immediate respiratory failure, death',
  },
  ecstasy: {
    name: 'Ecstasy',
    category: 'Empathogen',
    fillMultiplier: 0.9,
    urgeMultiplier: 0.3,
    heartRateBonus: 25,
    breathingBonus: 5,
    sphincterRelaxation: 0.25,
    suppressesUrge: true,
    addictive: false,
    overdoseRisk: true,
    overdoseThreshold: 3,
    duration: 3600,
    description: 'Party drug. Causes dehydration and overheating.',
    overdoseSymptoms: 'Hyperthermia, seizures, organ failure',
  },
  mushrooms: {
    name: 'Mushrooms',
    category: 'Hallucinogen',
    fillMultiplier: 0.8,
    urgeMultiplier: 0.2,
    heartRateBonus: 10,
    breathingBonus: 2,
    sphincterRelaxation: 0.15,
    suppressesUrge: true,
    addictive: false,
    overdoseRisk: false,
    overdoseThreshold: 999,
    duration: 4800,
    description: 'Psilocybin mushrooms. Alters perception of time and bodily sensations.',
  },
  dmt: {
    name: 'DMT',
    category: 'Hallucinogen',
    fillMultiplier: 0.7,
    urgeMultiplier: 0.1,
    heartRateBonus: 20,
    breathingBonus: 4,
    sphincterRelaxation: 0.3,
    suppressesUrge: true,
    addictive: false,
    overdoseRisk: false,
    overdoseThreshold: 999,
    duration: 1800,
    description: 'Powerful hallucinogen. Intense but short-lived trip.',
  },
  pcp: {
    name: 'PCP',
    category: 'Dissociative',
    fillMultiplier: 0.6,
    urgeMultiplier: 0.05,
    heartRateBonus: 30,
    breathingBonus: 6,
    sphincterRelaxation: 0.5,
    suppressesUrge: true,
    addictive: false,
    overdoseRisk: true,
    overdoseThreshold: 2,
    duration: 5400,
    description: 'Dissociative anesthetic. Causes complete detachment from reality.',
    overdoseSymptoms: 'Seizures, coma, death',
  },
  roxie: {
    name: 'Roxicodone',
    category: 'Opioid',
    fillMultiplier: 0.5,
    urgeMultiplier: 0.08,
    heartRateBonus: -18,
    breathingBonus: -5,
    sphincterRelaxation: 0.55,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 3,
    duration: 4200,
    description: 'Fast-acting opioid painkiller. Strong bladder suppression.',
    overdoseSymptoms: 'Respiratory depression, unconsciousness',
  },
  percocet: {
    name: 'Percocet',
    category: 'Opioid',
    fillMultiplier: 0.55,
    urgeMultiplier: 0.1,
    heartRateBonus: -15,
    breathingBonus: -4,
    sphincterRelaxation: 0.5,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 4,
    duration: 3600,
    description: 'Oxycodone + acetaminophen. Moderate bladder suppression.',
    overdoseSymptoms: 'Liver damage, respiratory failure',
  },
  ambien: {
    name: 'Ambien',
    category: 'Sedative',
    fillMultiplier: 0.7,
    urgeMultiplier: 0.15,
    heartRateBonus: -12,
    breathingBonus: -3,
    sphincterRelaxation: 0.4,
    suppressesUrge: true,
    addictive: true,
    overdoseRisk: true,
    overdoseThreshold: 5,
    duration: 4800,
    description: 'Sleep medication. Causes drowsiness and bladder relaxation.',
    overdoseSymptoms: 'Extreme drowsiness, respiratory depression',
  },
  nanobots: {
    name: 'Nanobots',
    category: 'Experimental',
    fillMultiplier: 1.0,
    urgeMultiplier: 1.0,
    heartRateBonus: 0,
    breathingBonus: 0,
    sphincterRelaxation: 0,
    suppressesUrge: false,
    addictive: false,
    overdoseRisk: false,
    overdoseThreshold: 999,
    duration: Infinity,
    description: 'Experimental nanotechnology. Grants player full control over heart rate and breathing. Lasts until manually turned off.',
  },
};

export const TIME_SPEEDS = [1, 5, 15, 30, 40, 60, 120, 150];
