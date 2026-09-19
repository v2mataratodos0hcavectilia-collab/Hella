import { useState, useCallback, useRef, useEffect } from 'react';
import { SimulationState, FluidType, FLUID_PROPERTIES, WARDROBE_TIMES, WardrobeType, Posture, LocationType, AIState, SocialMediaPost, SocialMediaComment, DrugType, DRUG_PROPERTIES, ActiveDrug, TrainingMethod, WeatherType, FoodType } from '../types';
import { DONATION_MESSAGES, MEGA_INFLUENCER_NAMES, FOLLOWER_SUGGESTION_TEMPLATES, POST_TEMPLATES } from '../socialContent';
import { ACHIEVEMENTS } from '../achievements';

const INITIAL_STATE: SimulationState = {
  simTime: 8 * 3600,
  timeSpeed: 1,
  isPaused: false,
  dayNumber: 1,
  bladderVolume: 50,
  maxCapacity: 500,
  fillRate: 1.2,
  bladderPressure: 5,
  sphincterFatigue: 0,
  sphincterLocked: false,
  sphincterTrembling: false,
  urgeSignal: 0,
  nerveSensitivity: 100,
  falseAlarm: false,
  urethralFlow: 0,
  urethralValveState: 'closed',
  aiState: 'idle',
  distractionLevel: 30,
  cognitiveState: 'relaxed',
  temperature: 72,
  wardrobe: 'jeans',
  posture: 'standing',
  location: 'home',
  heartRate: 72,
  breathingRate: 14,
  isSleeping: false,
  sleepWakeSignalDisabled: false,
  lastDrinkType: null,
  lastDrinkTime: 0,
  diureticMultiplier: 1,
  undressingProgress: 0,
  isUndressing: false,
  canAccessBathroom: true,
  trainingLevel: 0,
  desensitizationLevel: 0,
  trainingSpeedMultiplier: 1,
  fullBladderPreference: false,
  socialMediaPosts: [],
  isLiveStreaming: false,
  liveViewerCount: 0,
  liveStartTime: 0,
  activeSocialTab: 'posts',
  playerAccount: {
    username: 'Player1',
    posts: [],
    comments: [],
    following: ['Sarah_J'],
  },
  chatMessages: [],
  viewedProfile: null,
  activeDrugs: [],
  drugDoses: {
    caffeine: 0,
    adderall: 0,
    xanax: 0,
    oxycontin: 0,
    mdma: 0,
    lsd: 0,
    nicotine: 0,
    blazex: 0,
    serenol: 0,
    valium: 0,
    morphine: 0,
    ketamine: 0,
    ritalin: 0,
    meth: 0,
    cocaine: 0,
    heroin: 0,
    fentanyl: 0,
    ecstasy: 0,
    mushrooms: 0,
    dmt: 0,
    pcp: 0,
    roxie: 0,
    percocet: 0,
    ambien: 0,
    nanobots: 0,
  },
  isOverdosing: false,
  overdoseDrug: null,
  
  // Economy
  money: 50,
  totalEarned: 50,
  lastIncomeTime: 0,
  
  // Achievements
  unlockedAchievements: [],
  achievementProgress: {},
  
  // Enhanced social
  followerSuggestions: [],
  liveDonations: [],
  postComments: {},
  
  // Achievement tracking
  lastVoidTime: 8 * 3600, // Set to initial simTime so hold timer starts at 0
  totalStreams: 0,
  followerCount: 0,
  totalDrugsTaken: 0,
  drugsTried: [],
  overdosesSurvived: 0,
  
  // Death/pass out mechanics
  isPassedOut: false,
  passOutTime: 0,
  isDead: false,
  deathCause: '',
  consciousnessLevel: 100,
  deathCountdown: 0,
  isDying: false,
  
  // Nanobot control
  nanobotsActive: false,
  playerHeartRateControl: null,
  playerBreathingControl: null,
  
  // Weather & Time System
  weather: 'clear',
  season: 'spring',
  timeOfDay: 'morning',
  weatherChangeTimer: 0,
  
  // Relationships
  friends: [],
  family: [],
  romanticInterest: null,
  rival: null,
  
  // Stress & Food
  stressLevel: 0,
  lastFoodEaten: null,
  lastFoodTime: 0,
  
  // Training Specialization
  trainingMethod: 'none',
  bladderControlMode: false,
  bladderControlLevel: 0,
  trainingSpecializations: {
    sitting: 0,
    standing: 0,
    walking: 0,
    running: 0,
    sleeping: 0,
    social: 0,
  },
  
  // Economic Depth
  investments: [],
  debt: 0,
  monthlyExpenses: 500,
  careerLevel: 1,
  lastExpenseTime: 0,
  
  // Narrative
  memories: [],
  personalityTraits: [],
  lifeGoals: [],
  
  // Multi-Character
  otherCharacters: [],
  currentVisitors: [],
  cameraViewMode: 'her',
  
  // Custom Scenarios
  customScenarios: [],
};

interface PlayerOverrides {
  urgeSignal: boolean;
  distractionLevel: boolean;
  location: boolean;
  posture: boolean;
  temperature: boolean;
  fillRate: boolean;
}

function getSuggestionResponse(suggestion: string): string {
  // Context-aware responses based on suggestion type
  const holdingSuggestions = ['hold', 'holding', 'bladder', 'bathroom', 'pee', 'piss', 'urge'];
  const drinkingSuggestions = ['drink', 'coffee', 'water', 'tea', 'alcohol', 'fluid'];
  const streamingSuggestions = ['live', 'stream', 'video', 'camera'];
  const challengeSuggestions = ['challenge', 'try', 'attempt', 'contest'];
  
  const isHolding = holdingSuggestions.some(s => suggestion.toLowerCase().includes(s));
  const isDrinking = drinkingSuggestions.some(s => suggestion.toLowerCase().includes(s));
  const isStreaming = streamingSuggestions.some(s => suggestion.toLowerCase().includes(s));
  const isChallenge = challengeSuggestions.some(s => suggestion.toLowerCase().includes(s));
  
  // Enthusiastic responses
  const enthusiastic = [
    "Omg yes! I'm totally doing this! 🎉",
    "You're literally the best! Let's go! 💪",
    "This is exactly what I needed to hear! 🤩",
    "Challenge accepted! Watch me crush this! 🏆",
    "You always know just what to say! 😍",
  ];
  
  // Hesitant responses
  const hesitant = [
    "Hmm maybe... I'm kinda scared tbh 😅",
    "That sounds intense... but okay? 🤔",
    "I don't know if I can handle that... 😬",
    "You're crazy but I might try it... 😂",
    "Okay fine but if I regret it I'm blaming you! 😤",
  ];
  
  // Funny responses
  const funny = [
    "Lol you're trying to kill me aren't you? 💀",
    "My bladder already hates me but sure! 😭",
    "You're evil and I love it 😈",
    "This is either genius or insane... probably both 🤪",
    "Why do I trust you so much? 😂",
  ];
  
  // Grateful responses
  const grateful = [
    "Thank you! You always have the best ideas! 💕",
    "You're literally a lifesaver! 🙏",
    "I needed this push! Thanks bestie! ❤️",
    "You always know what's up! 🌟",
    "Seriously the best followers ever! 😭💕",
  ];
  
  // Sarcastic responses
  const sarcastic = [
    "Oh great, more suffering. Just what I wanted. 🙃",
    "Because my life isn't hard enough already... 😒",
    "Sure, let me just add that to my list of problems 📝",
    "Wow thanks for the trauma 😐",
    "You really care about my wellbeing don't you 🙄",
  ];
  
  // Holding-specific responses
  const holdingResponses = [
    "My bladder is already screaming but okay! 😫",
    "I'm literally doing the potty dance right now 💃",
    "Crossing my legs as we speak! 🦵",
    "The urge is REAL but I got this! 💪",
    "Send prayers and maybe a heating pad 🙏",
  ];
  
  // Drinking-specific responses
  const drinkingResponses = [
    "Already pouring my 5th cup! ☕☕☕☕☕",
    "My bladder is going to hate me but whatever! 🥤",
    "Hydration station activated! 💧",
    "This is either genius or a terrible idea... doing it anyway! 🤪",
    "Liquid courage incoming! 🍺",
  ];
  
  // Streaming-specific responses
  const streamingResponses = [
    "Camera's ready! Let's do this! 📹",
    "My followers are going to lose it! 😂",
    "Time to show everyone the struggle! 🎥",
    "Going live in 3... 2... 1... 🔴",
    "This is going to be epic! 🌟",
  ];
  
  // Select response category based on suggestion type
  let responsePool;
  if (isHolding) {
    responsePool = [...holdingResponses, ...enthusiastic.slice(0, 2), ...funny.slice(0, 2)];
  } else if (isDrinking) {
    responsePool = [...drinkingResponses, ...enthusiastic.slice(0, 2), ...sarcastic.slice(0, 2)];
  } else if (isStreaming) {
    responsePool = [...streamingResponses, ...enthusiastic.slice(0, 3)];
  } else if (isChallenge) {
    responsePool = [...enthusiastic, ...hesitant.slice(0, 2), ...funny.slice(0, 2)];
  } else {
    // Mix of all categories
    responsePool = [...enthusiastic, ...hesitant, ...funny, ...grateful, ...sarcastic];
  }
  
  return responsePool[Math.floor(Math.random() * responsePool.length)];
}

function generateSocialMediaPost(state: SimulationState): SocialMediaPost {
  const fillRatio = state.bladderVolume / state.maxCapacity;
  const urgePercent = state.urgeSignal;
  
  let content: string;
  let author: string;
  
  // 70% chance it's from the user, 30% from others
  if (Math.random() < 0.7) {
    author = "Sarah_J";
    
    // Choose post based on state and traits
    if (state.fullBladderPreference && fillRatio > 0.7) {
      content = POST_TEMPLATES.fullBladderPreference[Math.floor(Math.random() * POST_TEMPLATES.fullBladderPreference.length)];
    } else if (state.fullBladderPreference && fillRatio < 0.2) {
      content = POST_TEMPLATES.emptyBladderAnxiety[Math.floor(Math.random() * POST_TEMPLATES.emptyBladderAnxiety.length)];
    } else if (fillRatio > 0.7 || urgePercent > 70) {
      content = POST_TEMPLATES.bladderRelated[Math.floor(Math.random() * POST_TEMPLATES.bladderRelated.length)];
    } else {
      content = POST_TEMPLATES.normal[Math.floor(Math.random() * POST_TEMPLATES.normal.length)];
    }
    
    // Add context-aware details
    if (fillRatio > 0.8 && Math.random() < 0.3) {
      content += ` (Currently at ${Math.round(fillRatio * 100)}% capacity)`;
    }
    if (state.activeDrugs.length > 0 && Math.random() < 0.2) {
      const drugName = DRUG_PROPERTIES[state.activeDrugs[0].type].name;
      content += ` #${drugName}Vibes`;
    }
  } else {
    // Other users
    const otherUsers = ["CoffeeLover22", "NightOwl_", "FitnessFreak", "BookWorm99", "MusicVibes", "BladderFan99", "UrgentVibes", "HoldingQueen"];
    author = otherUsers[Math.floor(Math.random() * otherUsers.length)];
    
    const otherPosts = [
      "Anyone up for a chat? 💬",
      "Just saw the cutest dog! 🐕",
      "Monday motivation needed 😴",
      "What's everyone watching lately?",
      "Send memes pls 😂",
      "Can't sleep, anyone else? 🌙",
      "Coffee > Tea, fight me ☕",
      "Weekend can't come soon enough!",
      "Just finished a 5k! 🏃‍♀️",
      "Who else is procrastinating? 🙋‍♀️",
      "Living my best life ✨",
      "Need coffee ASAP ☕",
      "Anyone want to grab lunch?",
      "Just binged a whole series 📺",
      "Feeling productive today! ✅",
    ];
    content = otherPosts[Math.floor(Math.random() * otherPosts.length)];
  }
  
  return {
    id: `post_${Date.now()}_${Math.random()}`,
    author,
    content,
    timestamp: state.simTime,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
    isFromUser: author === "Sarah_J",
  };
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const [overrides, setOverrides] = useState<PlayerOverrides>({
    urgeSignal: false,
    distractionLevel: false,
    location: false,
    posture: false,
    temperature: false,
    fillRate: false,
  });
  const overridesRef = useRef<PlayerOverrides>(overrides);
  overridesRef.current = overrides;
  
  const lastUpdateRef = useRef<number>(Date.now());
  const animFrameRef = useRef<number>(0);
  
  // Track pending drink volume to add over time
  const pendingDrinkRef = useRef<{ volume: number; startTime: number; duration: number } | null>(null);

  const calculatePressure = useCallback((volume: number, maxCap: number) => {
    const ratio = volume / maxCap;
    return Math.min(120, 5 + Math.pow(ratio, 2.5) * 100);
  }, []);

  const calculateUrgeSignal = useCallback((pressure: number, sensitivity: number, distraction: number, fluidProps?: typeof FLUID_PROPERTIES.water) => {
    let baseUrge = (pressure / 120) * 100;
    baseUrge *= (sensitivity / 100);
    const distractionSuppression = 1 - (distraction / 200);
    baseUrge *= distractionSuppression;
    if (fluidProps?.urgeMultiplier) baseUrge *= fluidProps.urgeMultiplier;
    return Math.min(120, Math.max(0, baseUrge));
  }, []);

  const updateAI = useCallback((s: SimulationState, dt: number, playerOverrides: PlayerOverrides): SimulationState => {
    const newState = { ...s };
    const hour = (s.simTime / 3600) % 24;

    // Sleep logic (always applies)
    if (hour >= 23 || hour < 6) {
      if (!s.isSleeping) {
        newState.isSleeping = true;
        newState.aiState = 'sleeping';
        newState.cognitiveState = 'sleeping';
        if (!playerOverrides.posture) {
          newState.posture = 'lying_down';
        }
      }
    } else if (s.isSleeping && hour >= 6 && hour < 23) {
      newState.isSleeping = false;
    }

    // AI behavior - only if NOT manually overridden
    if (!s.isSleeping) {
      const urgePercent = s.urgeSignal;
      
      if (s.location === 'bathroom' && s.urethralValveState === 'release') {
        newState.aiState = 'voiding';
      } else if (urgePercent > 90 && !(s.fullBladderPreference && s.bladderVolume > s.maxCapacity * 0.7)) {
        // Desperate - searching for bathroom (unless full bladder preference trait is active and she's full)
        newState.aiState = 'searching_bathroom';
        newState.cognitiveState = 'desperate';
        // Only auto-move to bathroom if location not overridden
        if (!playerOverrides.location) {
          newState.location = 'home';
        }
        if (!playerOverrides.posture && s.posture === 'standing') {
          newState.posture = Math.random() > 0.5 ? 'walking' : 'standing';
        }
      } else if (s.fullBladderPreference && s.bladderVolume > s.maxCapacity * 0.7) {
        // Full bladder preference trait - extremely relaxed when full
        newState.aiState = 'idle';
        newState.cognitiveState = 'relaxed';
      } else if (urgePercent > 60) {
        const behaviors: AIState[] = ['holding', 'crossing_legs', 'shifting_weight', 'pacing'];
        if (Math.random() < 0.01 * dt) {
          newState.aiState = behaviors[Math.floor(Math.random() * behaviors.length)];
        }
        newState.cognitiveState = 'desperate';
      } else {
        // Time-based AI routine - only if NOT overridden
        if (hour >= 9 && hour < 12) {
          newState.aiState = 'working';
          newState.cognitiveState = 'focused';
          if (!playerOverrides.distractionLevel) newState.distractionLevel = 70;
          if (!playerOverrides.posture) newState.posture = 'sitting';
          if (!playerOverrides.location) newState.location = 'office';
        } else if (hour >= 12 && hour < 13) {
          newState.aiState = 'idle';
          if (!playerOverrides.location) newState.location = 'kitchen';
          if (!playerOverrides.posture) newState.posture = 'standing';
        } else if (hour >= 13 && hour < 17) {
          newState.aiState = 'in_meeting';
          newState.cognitiveState = 'focused';
          if (!playerOverrides.distractionLevel) newState.distractionLevel = 80;
          if (!playerOverrides.posture) newState.posture = 'sitting';
          if (!playerOverrides.location) newState.location = 'meeting_room';
        } else if (hour >= 17 && hour < 18) {
          newState.aiState = 'commuting';
          if (!playerOverrides.posture) newState.posture = 'sitting';
          if (!playerOverrides.location) newState.location = 'car';
          if (!playerOverrides.distractionLevel) newState.distractionLevel = 40;
        } else if (hour >= 20 && hour < 23) {
          newState.aiState = 'gaming';
          newState.cognitiveState = 'distracted';
          if (!playerOverrides.distractionLevel) newState.distractionLevel = 85;
          if (!playerOverrides.posture) newState.posture = 'sitting';
          if (!playerOverrides.location) newState.location = 'home';
        } else {
          newState.aiState = 'idle';
          newState.cognitiveState = 'relaxed';
          if (!playerOverrides.distractionLevel) newState.distractionLevel = 20;
          if (!playerOverrides.posture) newState.posture = 'standing';
          if (!playerOverrides.location) newState.location = 'home';
        }
      }

      // Random drink events
      if (Math.random() < 0.0003 * dt * s.timeSpeed) {
        const drinks: FluidType[] = ['water', 'coffee', 'tea', 'soda'];
        const drink = drinks[Math.floor(Math.random() * drinks.length)];
        newState.lastDrinkType = drink;
        newState.lastDrinkTime = s.simTime;
        const props = FLUID_PROPERTIES[drink];
        newState.diureticMultiplier = props.fillMultiplier;
      }
      
      // Random food events
      if (Math.random() < 0.0002 * dt * s.timeSpeed) {
        const foods: Array<'spicy' | 'salty' | 'sweet' | 'healthy' | 'junk' | 'diuretic_food'> = ['spicy', 'salty', 'sweet', 'healthy', 'junk', 'diuretic_food'];
        newState.lastFoodEaten = foods[Math.floor(Math.random() * foods.length)];
        newState.lastFoodTime = s.simTime;
      }
      
      // Stress level changes based on situation
      if (s.urgeSignal > 80) {
        newState.stressLevel = Math.min(100, newState.stressLevel + dt * 0.05);
      } else if (s.urgeSignal < 30 && s.bladderVolume < s.maxCapacity * 0.3) {
        newState.stressLevel = Math.max(0, newState.stressLevel - dt * 0.03);
      }
      
      // Weather affects stress
      if (newState.weather === 'stormy') {
        newState.stressLevel = Math.min(100, newState.stressLevel + dt * 0.02);
      } else if (newState.weather === 'clear' && newState.timeOfDay === 'morning') {
        newState.stressLevel = Math.max(0, newState.stressLevel - dt * 0.02);
      }
    }

    return newState;
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const realDt = (now - lastUpdateRef.current) / 1000;
    lastUpdateRef.current = now;

    setState(prev => {
      if (prev.isPaused) return prev;

      const simDt = realDt * prev.timeSpeed;
      const simMinutes = simDt / 60;

      let newState = { ...prev };
      newState.simTime += simDt;

      // Day tracking
      if (newState.simTime >= 24 * 3600) {
        newState.simTime -= 24 * 3600;
        newState.dayNumber += 1;
        
        // Season changes every 30 days
        if (newState.dayNumber % 30 === 0) {
          const seasons: Array<'spring' | 'summer' | 'fall' | 'winter'> = ['spring', 'summer', 'fall', 'winter'];
          const currentSeasonIndex = seasons.indexOf(newState.season);
          newState.season = seasons[(currentSeasonIndex + 1) % 4];
        }
      }
      
      // Time of day update
      const hour = Math.floor(newState.simTime / 3600) % 24;
      if (hour >= 5 && hour < 7) newState.timeOfDay = 'dawn';
      else if (hour >= 7 && hour < 12) newState.timeOfDay = 'morning';
      else if (hour >= 12 && hour < 17) newState.timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 20) newState.timeOfDay = 'evening';
      else newState.timeOfDay = 'night';
      
      // Weather changes (every 2-6 hours sim time)
      newState.weatherChangeTimer -= simDt;
      if (newState.weatherChangeTimer <= 0) {
        const weathers: Array<'clear' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'hot' | 'cold'> = ['clear', 'cloudy', 'rainy', 'snowy', 'stormy', 'hot', 'cold'];
        // Season affects weather likelihood
        if (newState.season === 'winter') {
          newState.weather = Math.random() < 0.4 ? 'snowy' : Math.random() < 0.3 ? 'cold' : weathers[Math.floor(Math.random() * 3)];
        } else if (newState.season === 'summer') {
          newState.weather = Math.random() < 0.3 ? 'hot' : Math.random() < 0.2 ? 'stormy' : weathers[Math.floor(Math.random() * 3)];
        } else {
          newState.weather = weathers[Math.floor(Math.random() * weathers.length)];
        }
        newState.weatherChangeTimer = (2 + Math.random() * 4) * 3600; // 2-6 hours
      }

      // Process pending drink (gradual filling)
      if (pendingDrinkRef.current) {
        const drink = pendingDrinkRef.current;
        const elapsed = newState.simTime - drink.startTime;
        const progress = Math.min(1, elapsed / drink.duration);
        
        if (progress < 1) {
          // Add volume gradually
          const volumeThisTick = (drink.volume / drink.duration) * simDt;
          if (newState.urethralValveState !== 'release') {
            newState.bladderVolume = Math.min(newState.maxCapacity * 1.2, newState.bladderVolume + volumeThisTick);
          }
        } else {
          // Drink finished
          pendingDrinkRef.current = null;
        }
      }

      // Calculate effective fill rate
      let effectiveFillRate = newState.fillRate * newState.diureticMultiplier;

      // Temperature effects (always apply based on current temperature)
      if (newState.temperature < 60) {
        effectiveFillRate *= 1.3;
      } else if (newState.temperature > 85) {
        effectiveFillRate *= 0.7;
      }
      
      // Weather effects on fill rate
      if (newState.weather === 'cold' || newState.weather === 'snowy') {
        effectiveFillRate *= 1.2; // Cold weather increases fill rate
      } else if (newState.weather === 'hot') {
        effectiveFillRate *= 0.8; // Hot weather decreases fill rate (sweating)
      } else if (newState.weather === 'rainy' || newState.weather === 'stormy') {
        effectiveFillRate *= 1.1; // Rain increases urgency slightly
      }
      
      // Stress effects on fill rate
      if (newState.stressLevel > 70) {
        effectiveFillRate *= 1.3; // High stress increases fill rate
      } else if (newState.stressLevel < 30) {
        effectiveFillRate *= 0.9; // Low stress decreases fill rate
      }
      
      // Food effects (lasts 2 hours after eating)
      if (newState.lastFoodEaten && newState.simTime - newState.lastFoodTime < 7200) {
        if (newState.lastFoodEaten === 'spicy') {
          effectiveFillRate *= 1.2; // Spicy food increases urgency
        } else if (newState.lastFoodEaten === 'diuretic_food') {
          effectiveFillRate *= 1.4; // Diuretic foods increase fill rate significantly
        } else if (newState.lastFoodEaten === 'healthy') {
          effectiveFillRate *= 0.9; // Healthy food slightly decreases fill rate
        }
      }
      
      // Activity-based fill rate (posture affects it)
      if (newState.posture === 'running') {
        effectiveFillRate *= 1.3; // Running increases fill rate
      } else if (newState.posture === 'walking') {
        effectiveFillRate *= 1.1; // Walking slightly increases fill rate
      } else if (newState.isSleeping) {
        effectiveFillRate *= 0.6; // Sleeping decreases fill rate significantly
      }

      // Fill bladder (from kidneys, not drinks)
      if (newState.urethralValveState !== 'release') {
        const addedVolume = effectiveFillRate * simMinutes;
        newState.bladderVolume = Math.min(newState.maxCapacity * 1.2, newState.bladderVolume + addedVolume);
      }

      // Carbonation pressure spikes
      if (newState.lastDrinkType === 'soda' && newState.simTime - newState.lastDrinkTime < 1800) {
        const spike = Math.sin(newState.simTime * 0.5) * 3;
        newState.bladderPressure = calculatePressure(newState.bladderVolume, newState.maxCapacity) + spike;
      } else {
        newState.bladderPressure = calculatePressure(newState.bladderVolume, newState.maxCapacity);
      }

      // Posture effects on pressure
      if (newState.posture === 'sitting') {
        newState.bladderPressure *= 1.1;
      } else if (newState.posture === 'walking' || newState.posture === 'running') {
        const bounce = Math.sin(newState.simTime * 3) * 2;
        newState.bladderPressure += bounce;
      }

      // Crossing legs reduces pressure
      if (newState.aiState === 'crossing_legs') {
        newState.bladderPressure *= 0.85;
      }

      // Hot bath/sauna relaxes sphincter
      if (newState.temperature > 100) {
        newState.sphincterFatigue = Math.min(100, newState.sphincterFatigue + simDt * 0.1);
      }

      // Urge signal calculation (only if NOT manually overridden)
      if (!overridesRef.current.urgeSignal) {
        const fluidProps = newState.lastDrinkType ? FLUID_PROPERTIES[newState.lastDrinkType] : undefined;
        newState.urgeSignal = calculateUrgeSignal(
          newState.bladderPressure,
          newState.nerveSensitivity,
          newState.distractionLevel,
          fluidProps
        );
        
        // Full bladder preference trait: likes full bladder, anxious when empty
        if (newState.fullBladderPreference) {
          const fillRatio = newState.bladderVolume / newState.maxCapacity;
          if (fillRatio > 0.7) {
            // Likes being full - extremely calm, relaxed, and thinks clearly
            newState.urgeSignal *= 0.2; // Very low urge perception
            newState.cognitiveState = 'relaxed';
            newState.distractionLevel = Math.max(newState.distractionLevel, 80);
            // Clear thinking at high urge - no confusion or desperation
            newState.heartRate -= 10;
            newState.breathingRate -= 3;
          } else if (fillRatio < 0.2) {
            // Anxious when empty - increased stress
            newState.urgeSignal = Math.max(newState.urgeSignal, 60);
            newState.heartRate += 20; // Anxiety increases heart rate
            newState.breathingRate += 5; // Anxiety increases breathing
          }
          
          // HIGH URGE = CLEAR THINKING (trait-specific behavior)
          // At high urges, she becomes focused and clear-headed instead of desperate
          if (newState.urgeSignal > 80) {
            newState.cognitiveState = 'focused';
            newState.distractionLevel = Math.max(0, newState.distractionLevel - 20);
            // Reduce desperate behaviors - calm holding instead of frantic searching
            if (newState.aiState === 'searching_bathroom' || newState.aiState === 'pacing') {
              newState.aiState = 'holding';
            }
          }
        }
      }

      // False alarm override
      if (newState.falseAlarm) {
        newState.urgeSignal = Math.max(newState.urgeSignal, 80);
      }

      // Sphincter fatigue
      if (newState.sphincterLocked && !newState.isSleeping) {
        newState.sphincterFatigue = Math.min(100, newState.sphincterFatigue + simDt * 0.05);
        if (newState.sphincterFatigue > 70) {
          newState.sphincterTrembling = true;
        }
      } else if (!newState.sphincterLocked) {
        newState.sphincterFatigue = Math.max(0, newState.sphincterFatigue - simDt * 0.02);
        if (newState.sphincterFatigue < 50) {
          newState.sphincterTrembling = false;
        }
      }

      // Sleep - sphincter never fatigues
      if (newState.isSleeping) {
        newState.sphincterFatigue = Math.max(0, newState.sphincterFatigue - simDt * 0.01);
        if (newState.sleepWakeSignalDisabled) {
          newState.urgeSignal = Math.min(newState.urgeSignal, 30);
        }
      }

      // Urethral flow
      if (newState.urethralValveState === 'drip') {
        newState.urethralFlow = 0.5;
        newState.bladderVolume = Math.max(0, newState.bladderVolume - 0.5 * simDt);
      } else if (newState.urethralValveState === 'leak') {
        newState.urethralFlow = 2;
        newState.bladderVolume = Math.max(0, newState.bladderVolume - 2 * simDt);
      } else if (newState.urethralValveState === 'release') {
        newState.urethralFlow = 25;
        newState.bladderVolume = Math.max(0, newState.bladderVolume - 25 * simDt);
        if (newState.bladderVolume <= 0) {
          newState.urethralValveState = 'closed';
          newState.urethralFlow = 0;
          newState.bladderVolume = 0;
          newState.lastVoidTime = newState.simTime; // Update last void time for achievements
        }
      } else {
        newState.urethralFlow = 0;
      }

      // Process active drugs
      newState.activeDrugs = newState.activeDrugs.filter(drug => {
        const elapsed = newState.simTime - drug.startTime;
        return elapsed < drug.duration;
      });

      // Apply drug effects
      let totalDrugHeartRate = 0;
      let totalDrugBreathing = 0;
      let totalDrugSphincterRelaxation = 0;
      let totalDrugFillMultiplier = 1;
      let totalDrugUrgeMultiplier = 1;
      let anyDrugSuppressesUrge = false;

      newState.activeDrugs.forEach(drug => {
        const props = DRUG_PROPERTIES[drug.type];
        const progress = (newState.simTime - drug.startTime) / drug.duration;
        const intensity = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;
        
        totalDrugHeartRate += props.heartRateBonus * intensity;
        totalDrugBreathing += props.breathingBonus * intensity;
        totalDrugSphincterRelaxation += props.sphincterRelaxation * intensity;
        totalDrugFillMultiplier *= (1 + (props.fillMultiplier - 1) * intensity);
        totalDrugUrgeMultiplier *= (1 + (props.urgeMultiplier - 1) * intensity);
        if (props.suppressesUrge) anyDrugSuppressesUrge = true;
      });

      // Apply drug effects to vitals
      newState.heartRate += totalDrugHeartRate;
      newState.breathingRate += totalDrugBreathing;
      newState.sphincterFatigue = Math.min(100, newState.sphincterFatigue + totalDrugSphincterRelaxation * simDt * 0.1);

      // Apply drug effects to fill rate
      effectiveFillRate *= totalDrugFillMultiplier;

      // Apply drug effects to urge
      if (anyDrugSuppressesUrge) {
        newState.urgeSignal *= totalDrugUrgeMultiplier;
      }

      // Check for overdose
      newState.isOverdosing = false;
      newState.overdoseDrug = null;
      Object.entries(newState.drugDoses).forEach(([drugType, doses]) => {
        const props = DRUG_PROPERTIES[drugType as DrugType];
        if (props.overdoseRisk && doses >= props.overdoseThreshold) {
          newState.isOverdosing = true;
          newState.overdoseDrug = drugType as DrugType;
          newState.heartRate += 50;
          newState.breathingRate += 10;
        }
      });

      // Heart rate and breathing
      const urgencyFactor = newState.urgeSignal / 100;
      newState.heartRate = 72 + urgencyFactor * 40 + (newState.sphincterTrembling ? 10 : 0) + totalDrugHeartRate;
      newState.breathingRate = 14 + urgencyFactor * 12 + totalDrugBreathing;

      // Full bladder preference trait effects on vitals
      if (newState.fullBladderPreference) {
        const fillRatio = newState.bladderVolume / newState.maxCapacity;
        if (fillRatio > 0.7) {
          // Calm when full
          newState.heartRate -= 10;
          newState.breathingRate -= 3;
        } else if (fillRatio < 0.2) {
          // Anxious when empty
          newState.heartRate += 20;
          newState.breathingRate += 5;
        }
      }

      // Nanobot control - override vitals if player has control
      if (newState.nanobotsActive) {
        if (newState.playerHeartRateControl !== null) {
          newState.heartRate = newState.playerHeartRateControl;
        }
        if (newState.playerBreathingControl !== null) {
          newState.breathingRate = newState.playerBreathingControl;
        }
      }

      // Gradual death system - consciousness drain based on vitals
      if (!newState.isDead) {
        let consciousnessDrainRate = 0; // % per second
        let deathCause = '';
        
        // Heart rate effects
        if (newState.heartRate === 0) {
          consciousnessDrainRate += 10; // Fast drain - cardiac arrest
          deathCause = 'Cardiac arrest (0 BPM)';
        } else if (newState.heartRate < 20) {
          consciousnessDrainRate += 5; // Severe bradycardia
          deathCause = 'Severe bradycardia';
        } else if (newState.heartRate < 30) {
          consciousnessDrainRate += 2; // Moderate bradycardia
          deathCause = 'Bradycardia';
        } else if (newState.heartRate > 350) {
          consciousnessDrainRate += 10; // Ventricular fibrillation
          deathCause = 'Ventricular fibrillation';
        } else if (newState.heartRate > 300) {
          consciousnessDrainRate += 5; // Extreme tachycardia
          deathCause = 'Extreme tachycardia';
        } else if (newState.heartRate > 250) {
          consciousnessDrainRate += 2; // Severe tachycardia
          deathCause = 'Severe tachycardia';
        }
        
        // Breathing rate effects
        if (newState.breathingRate === 0) {
          consciousnessDrainRate += 10; // Respiratory arrest
          deathCause = 'Respiratory arrest (0 BrPM)';
        } else if (newState.breathingRate < 3) {
          consciousnessDrainRate += 5; // Severe respiratory depression
          deathCause = 'Severe respiratory depression';
        } else if (newState.breathingRate < 5) {
          consciousnessDrainRate += 2; // Respiratory depression
          deathCause = 'Respiratory depression';
        }
        
        // Overdose effects
        if (newState.isOverdosing && newState.overdoseDrug) {
          const drugType = newState.overdoseDrug as DrugType;
          const drugProps = DRUG_PROPERTIES[drugType];
          if (drugProps.overdoseSymptoms?.includes('death')) {
            consciousnessDrainRate += 3;
            deathCause = `Overdose: ${drugProps.name}`;
          }
        }
        
        // Apply consciousness drain
        if (consciousnessDrainRate > 0) {
          newState.consciousnessLevel = Math.max(0, newState.consciousnessLevel - consciousnessDrainRate * simDt);
          newState.isDying = true;
          
          if (deathCause && !newState.deathCause) {
            newState.deathCause = deathCause;
          }
          
          // Pass out when consciousness gets low
          if (newState.consciousnessLevel < 20 && !newState.isPassedOut) {
            newState.isPassedOut = true;
            newState.passOutTime = newState.simTime;
          }
          
          // Track death countdown
          if (newState.consciousnessLevel === 0) {
            newState.deathCountdown += simDt;
            
            // Die after 30 seconds at 0 consciousness
            if (newState.deathCountdown >= 30) {
              newState.isDead = true;
            }
          } else {
            newState.deathCountdown = 0;
          }
        } else {
          // Recovery - consciousness regenerates when vitals are healthy
          newState.isDying = false;
          if (newState.consciousnessLevel < 100) {
            newState.consciousnessLevel = Math.min(100, newState.consciousnessLevel + 1 * simDt);
          }
          
          // Wake up from pass out if consciousness recovers
          if (newState.isPassedOut && newState.consciousnessLevel > 50) {
            newState.isPassedOut = false;
          }
        }
      }

      // Bladder training - dependent on bladder fullness, NOT urge signal
      // Training starts at 100% capacity, faster when bulging (>100%)
      const fillRatio = newState.bladderVolume / newState.maxCapacity;
      if (fillRatio >= 1.0) {
        const trainingRate = 0.0001 * newState.trainingSpeedMultiplier;
        // Bulging (>100%) trains 2x faster
        const bulgingMultiplier = fillRatio > 1.0 ? 2.0 : 1.0;
        const rawLevel = newState.trainingLevel + simDt * trainingRate * bulgingMultiplier;
        // Round to nearest hundredth
        newState.trainingLevel = Math.min(30, Math.round(rawLevel * 100) / 100);
        // Round maxCapacity to nearest 100
        const rawCapacity = 500 + newState.trainingLevel * 20;
        newState.maxCapacity = Math.min(1100, Math.round(rawCapacity / 100) * 100);
        newState.desensitizationLevel = Math.min(100, newState.desensitizationLevel + simDt * trainingRate * 10);
        newState.nerveSensitivity = Math.max(30, 100 - newState.desensitizationLevel * 0.7);
      }

      // Diuretic decay
      if (newState.simTime - newState.lastDrinkTime > 3600) {
        newState.diureticMultiplier = 1;
      }

      // Update AI (respects player overrides)
      newState = updateAI(newState, simDt, overridesRef.current);

      // Social media activity
      if (!newState.isSleeping) {
        // Random chance to post based on activity level
        const postChance = 0.0002 * simDt * newState.timeSpeed;
        if (Math.random() < postChance && newState.socialMediaPosts.length < 50) {
          const post = generateSocialMediaPost(newState);
          newState.socialMediaPosts = [post, ...newState.socialMediaPosts].slice(0, 50);
        }
        
        // Random chance to go live - based on mood/feeling, not just bladder
        if (!newState.isLiveStreaming) {
          let liveChance = 0.00003 * simDt * newState.timeSpeed;
          
          // Full bladder preference trait makes her more likely to go live when full
          if (newState.fullBladderPreference && newState.bladderVolume > newState.maxCapacity * 0.7) {
            liveChance *= 3; // 3x more likely when trait active and bladder is full
          }
          
          // Other factors that increase likelihood
          if (newState.distractionLevel > 70) liveChance *= 1.5; // Bored/distracted
          if (newState.cognitiveState === 'relaxed') liveChance *= 1.2; // Feeling good
          if (newState.urgeSignal > 80 && !newState.fullBladderPreference) liveChance *= 0.3; // Less likely when desperate (unless trait active)
          
          if (Math.random() < liveChance) {
            newState.isLiveStreaming = true;
            newState.liveStartTime = newState.simTime;
            newState.liveViewerCount = Math.floor(Math.random() * 50) + 10;
            newState.totalStreams += 1;
          }
        }
        
        // Update live stream
        if (newState.isLiveStreaming) {
          newState.liveViewerCount += Math.floor((Math.random() - 0.3) * 5);
          newState.liveViewerCount = Math.max(5, newState.liveViewerCount);
          
          // Update follower count based on viewers
          if (Math.random() < 0.01 * simDt * newState.timeSpeed) {
            newState.followerCount += Math.floor(Math.random() * 3) + 1;
          }
          
          // Generate donations during stream
          if (Math.random() < 0.005 * simDt * newState.timeSpeed * (newState.liveViewerCount / 50)) {
            const isMega = Math.random() < 0.02; // 2% chance of mega influencer
            const donation = {
              id: `donation_${Date.now()}_${Math.random()}`,
              viewer: isMega ? MEGA_INFLUENCER_NAMES[Math.floor(Math.random() * MEGA_INFLUENCER_NAMES.length)] : `Viewer${Math.floor(Math.random() * 9999)}`,
              amount: isMega ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 29) + 1,
              message: DONATION_MESSAGES[Math.floor(Math.random() * DONATION_MESSAGES.length)],
              timestamp: newState.simTime,
              isMegaInfluencer: isMega,
            };
            newState.liveDonations = [donation, ...newState.liveDonations].slice(0, 20);
            newState.money += donation.amount;
            newState.totalEarned += donation.amount;
          }
          
          // End stream after 10-30 minutes sim time
          if (newState.simTime - newState.liveStartTime > 600 + Math.random() * 1200) {
            newState.isLiveStreaming = false;
          }
        }
        
        // Generate follower suggestions
        if (Math.random() < 0.001 * simDt * newState.timeSpeed && newState.followerSuggestions.length < 10) {
          const suggestion = {
            id: `suggestion_${Date.now()}_${Math.random()}`,
            follower: `Follower${Math.floor(Math.random() * 9999)}`,
            suggestion: FOLLOWER_SUGGESTION_TEMPLATES[Math.floor(Math.random() * FOLLOWER_SUGGESTION_TEMPLATES.length)],
            timestamp: newState.simTime,
            responded: false,
          };
          newState.followerSuggestions = [suggestion, ...newState.followerSuggestions].slice(0, 10);
        }

        // AI responds to recommendations (30% chance per suggestion per minute)
        newState.followerSuggestions = newState.followerSuggestions.map(suggestion => {
          if (!suggestion.responded && Math.random() < 0.005 * simDt * newState.timeSpeed) {
            // Add response as a comment on the suggestion
            const response = getSuggestionResponse(suggestion.suggestion);
            return { 
              ...suggestion, 
              responded: true,
              response: response,
              responseTimestamp: newState.simTime,
            };
          }
          return suggestion;
        });
        
        // Follower income (capped at 30× simulation minutes)
        const incomeInterval = Math.min(30 * 60, 60); // Max 30 minutes, check every minute
        if (newState.simTime - newState.lastIncomeTime >= incomeInterval && newState.followerCount >= 10) {
          let incomePerMinute = 0;
          if (newState.followerCount >= 200) incomePerMinute = 0.50;
          else if (newState.followerCount >= 100) incomePerMinute = 0.30;
          else if (newState.followerCount >= 50) incomePerMinute = 0.15;
          else incomePerMinute = 0.05;
          
          const income = incomePerMinute * incomeInterval;
          newState.money += income;
          newState.totalEarned += income;
          newState.lastIncomeTime = newState.simTime;
        }

        // Generate chat messages between AI users
        if (Math.random() < 0.001 * simDt * newState.timeSpeed && newState.chatMessages.length < 100) {
          const chatUsers = ['BladderFan99', 'UrgentVibes', 'HoldingQueen', 'PeePeePooPoo', 'FullBladderClub', 'DesperateDan', 'CoffeeLover22', 'NightOwl_'];
          const chatMessages = [
            "Anyone else struggling to hold it rn? 😩",
            "Just hit 80% capacity and feeling great!",
            "Who's going live later?",
            "This holding challenge is intense!",
            "My bladder is screaming but I'm not giving up 💪",
            "Anyone want to start a holding contest?",
            "Just drank 3 coffees... send help ☕☕☕",
            "The urge is real today guys",
            "Crossing legs is my cardio 🦵",
            "Living my best (full) life rn 😌",
            "Can't believe how long I've been holding",
            "Anyone else doing the potty dance? 💃",
            "Bladder goals right here 🏆",
            "This is either genius or insane 🤪",
            "Send prayers and maybe a heating pad 🙏",
          ];
          
          const chatMessage = {
            id: `chat_${Date.now()}_${Math.random()}`,
            author: chatUsers[Math.floor(Math.random() * chatUsers.length)],
            message: chatMessages[Math.floor(Math.random() * chatMessages.length)],
            timestamp: newState.simTime,
            isFromUser: false,
          };
          newState.chatMessages = [...newState.chatMessages, chatMessage].slice(-100);
        }
      }

      // Check achievements
      ACHIEVEMENTS.forEach(achievement => {
        // Only check if not already unlocked
        if (!newState.unlockedAchievements.includes(achievement.id)) {
          if (achievement.check(newState)) {
            newState.unlockedAchievements = [...newState.unlockedAchievements, achievement.id];
            newState.money += achievement.reward;
            newState.totalEarned += achievement.reward;
          }
        }
      });

      return newState;
    });

    animFrameRef.current = requestAnimationFrame(tick);
  }, [calculatePressure, calculateUrgeSignal, updateAI]);

  useEffect(() => {
    lastUpdateRef.current = Date.now();
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [tick]);

  // Control functions with override flags
  const setUrgeSignal = useCallback((value: number) => {
    setOverrides(prev => ({ ...prev, urgeSignal: true }));
    setState(prev => ({ ...prev, urgeSignal: value }));
  }, []);

  const setFalseAlarm = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, falseAlarm: value }));
  }, []);

  const setSphincterLock = useCallback((locked: boolean) => {
    setState(prev => ({ ...prev, sphincterLocked: locked }));
  }, []);

  const setUrethralValve = useCallback((valveState: 'closed' | 'drip' | 'leak' | 'release') => {
    setState(prev => ({ ...prev, urethralValveState: valveState }));
  }, []);

  const setFillRate = useCallback((rate: number) => {
    setOverrides(prev => ({ ...prev, fillRate: true }));
    setState(prev => ({ ...prev, fillRate: rate }));
  }, []);

  const setTimeSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, timeSpeed: speed }));
  }, []);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetSimulation = useCallback(() => {
    setOverrides({
      urgeSignal: false,
      distractionLevel: false,
      location: false,
      posture: false,
      temperature: false,
      fillRate: false,
    });
    pendingDrinkRef.current = null;
    setState({ ...INITIAL_STATE, simTime: 8 * 3600, lastVoidTime: 8 * 3600 });
  }, []);

  const loadScenario = useCallback((overrides: Partial<SimulationState>) => {
    setOverrides({
      urgeSignal: false,
      distractionLevel: false,
      location: false,
      posture: false,
      temperature: false,
      fillRate: false,
    });
    pendingDrinkRef.current = null;
    const simTime = overrides.simTime || 8 * 3600;
    setState(prev => ({
      ...INITIAL_STATE,
      ...overrides,
      simTime,
      lastVoidTime: overrides.lastVoidTime || simTime, // Set lastVoidTime to match simTime
    }));
  }, []);

  const setTemperature = useCallback((temp: number) => {
    setOverrides(prev => ({ ...prev, temperature: true }));
    setState(prev => ({ ...prev, temperature: temp }));
  }, []);

  const setWardrobe = useCallback((wardrobe: WardrobeType) => {
    setState(prev => ({ ...prev, wardrobe }));
  }, []);

  const setPosture = useCallback((posture: Posture) => {
    setOverrides(prev => ({ ...prev, posture: true }));
    setState(prev => ({ ...prev, posture }));
  }, []);

  const setLocation = useCallback((location: LocationType) => {
    setOverrides(prev => ({ ...prev, location: true }));
    setState(prev => ({ ...prev, location }));
  }, []);

  const setDistraction = useCallback((level: number) => {
    setOverrides(prev => ({ ...prev, distractionLevel: true }));
    setState(prev => ({ ...prev, distractionLevel: level }));
  }, []);

  const setSleepWakeSignal = useCallback((disabled: boolean) => {
    setState(prev => ({ ...prev, sleepWakeSignalDisabled: disabled }));
  }, []);

  const manualReset = useCallback(() => {
    pendingDrinkRef.current = null;
    setState(prev => ({
      ...prev,
      bladderVolume: 0,
      bladderPressure: 5,
      urgeSignal: 0,
      nerveSensitivity: 100,
      sphincterFatigue: 0,
      sphincterTrembling: false,
      trainingLevel: 0,
      desensitizationLevel: 0,
      maxCapacity: 500,
      urethralValveState: 'closed',
      lastVoidTime: prev.simTime, // Update last void time for achievements
      urethralFlow: 0,
    }));
    setOverrides(prev => ({ ...prev, urgeSignal: false }));
  }, []);

  // Give drink - adds volume gradually over 5 minutes of sim time
  const giveDrink = useCallback((type: FluidType) => {
    const props = FLUID_PROPERTIES[type];
    const volume = 250 * props.volumeMultiplier;
    
    setState(prev => {
      // Set up gradual drink consumption (5 minutes = 300 seconds of sim time)
      pendingDrinkRef.current = {
        volume,
        startTime: prev.simTime,
        duration: 300, // 5 minutes of sim time
      };
      
      return {
        ...prev,
        lastDrinkType: type,
        lastDrinkTime: prev.simTime,
        diureticMultiplier: props.fillMultiplier,
      };
    });
  }, []);

  const setTrainingSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, trainingSpeedMultiplier: speed }));
  }, []);

  const toggleFullBladderPreference = useCallback(() => {
    setState(prev => ({ ...prev, fullBladderPreference: !prev.fullBladderPreference }));
  }, []);

  const giveDrug = useCallback((type: DrugType) => {
    setState(prev => {
      const props = DRUG_PROPERTIES[type];
      const newDose = (prev.drugDoses[type] || 0) + 1;
      
      const newDrug: ActiveDrug = {
        type,
        startTime: prev.simTime,
        duration: props.duration,
        dose: newDose,
      };

      // Special handling for nanobots
      if (type === 'nanobots') {
        return {
          ...prev,
          nanobotsActive: true,
          activeDrugs: [...prev.activeDrugs, newDrug],
          drugDoses: {
            ...prev.drugDoses,
            [type]: newDose,
          },
        };
      }

      return {
        ...prev,
        activeDrugs: [...prev.activeDrugs, newDrug],
        drugDoses: {
          ...prev.drugDoses,
          [type]: newDose,
        },
      };
    });
  }, []);

  const setHeartRateControl = useCallback((bpm: number | null) => {
    setState(prev => ({ ...prev, playerHeartRateControl: bpm }));
  }, []);

  const setBreathingControl = useCallback((brpm: number | null) => {
    setState(prev => ({ ...prev, playerBreathingControl: brpm }));
  }, []);

  const toggleNanobots = useCallback(() => {
    setState(prev => {
      if (prev.nanobotsActive) {
        // Turn off nanobots
        return {
          ...prev,
          nanobotsActive: false,
          playerHeartRateControl: null,
          playerBreathingControl: null,
          activeDrugs: prev.activeDrugs.filter(d => d.type !== 'nanobots'),
        };
      } else {
        // Turn on nanobots
        const newDrug: ActiveDrug = {
          type: 'nanobots',
          startTime: prev.simTime,
          duration: Infinity,
          dose: (prev.drugDoses.nanobots || 0) + 1,
        };
        return {
          ...prev,
          nanobotsActive: true,
          activeDrugs: [...prev.activeDrugs, newDrug],
          drugDoses: {
            ...prev.drugDoses,
            nanobots: (prev.drugDoses.nanobots || 0) + 1,
          },
        };
      }
    });
  }, []);

  const setActiveSocialTab = useCallback((tab: 'live' | 'posts' | 'recommendations' | 'explore' | 'personal' | 'chat') => {
    setState(prev => ({ ...prev, activeSocialTab: tab }));
  }, []);

  const setViewedProfile = useCallback((profile: string | null) => {
    setState(prev => ({ ...prev, viewedProfile: profile }));
  }, []);

  const playerPost = useCallback((content: string) => {
    setState(prev => {
      const newPost: SocialMediaPost = {
        id: `player_post_${Date.now()}_${Math.random()}`,
        author: prev.playerAccount.username,
        content,
        timestamp: prev.simTime,
        likes: 0,
        comments: 0,
        isFromUser: true,
        commentList: [],
      };
      return {
        ...prev,
        playerAccount: {
          ...prev.playerAccount,
          posts: [newPost, ...prev.playerAccount.posts].slice(0, 50),
        },
      };
    });
  }, []);

  const playerComment = useCallback((postId: string, content: string) => {
    setState(prev => {
      const newComment: SocialMediaComment = {
        id: `player_comment_${Date.now()}_${Math.random()}`,
        author: prev.playerAccount.username,
        content,
        timestamp: prev.simTime,
        likes: 0,
        isFromPlayer: true,
      };
      
      // Add comment to player's post
      const updatedPosts = prev.playerAccount.posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentList: [...(post.commentList || []), newComment],
            comments: post.comments + 1,
          };
        }
        return post;
      });
      
      return {
        ...prev,
        playerAccount: {
          ...prev.playerAccount,
          posts: updatedPosts,
          comments: [...prev.playerAccount.comments, newComment],
        },
      };
    });
  }, []);

  // New feature control functions
  const setTrainingMethod = useCallback((method: TrainingMethod) => {
    setState(prev => ({ ...prev, trainingMethod: method }));
  }, []);

  const toggleBladderControlMode = useCallback(() => {
    setState(prev => ({ ...prev, bladderControlMode: !prev.bladderControlMode }));
  }, []);

  const setWeather = useCallback((weather: WeatherType) => {
    setState(prev => ({ ...prev, weather }));
  }, []);

  const setStressLevel = useCallback((level: number) => {
    setState(prev => ({ ...prev, stressLevel: Math.max(0, Math.min(100, level)) }));
  }, []);

  const eatFood = useCallback((food: FoodType) => {
    setState(prev => ({
      ...prev,
      lastFoodEaten: food,
      lastFoodTime: prev.simTime,
    }));
  }, []);

  const setCameraViewMode = useCallback((mode: 'her' | 'others') => {
    setState(prev => ({ ...prev, cameraViewMode: mode }));
  }, []);

  return {
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
    loadScenario,
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
    setActiveSocialTab,
    playerPost,
    playerComment,
    setHeartRateControl,
    setBreathingControl,
    toggleNanobots,
    setViewedProfile,
    setTrainingMethod,
    toggleBladderControlMode,
    setWeather,
    setStressLevel,
    eatFood,
    setCameraViewMode,
  };
}
