import { useState, useCallback, useRef, useEffect } from 'react';
import { SimulationState, FluidType, FLUID_PROPERTIES, WARDROBE_TIMES, WardrobeType, Posture, LocationType, AIState } from '../types';

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
};

interface PlayerOverrides {
  urgeSignal: boolean;
  distractionLevel: boolean;
  location: boolean;
  posture: boolean;
  temperature: boolean;
  fillRate: boolean;
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
      } else if (urgePercent > 90) {
        newState.aiState = 'searching_bathroom';
        newState.cognitiveState = 'desperate';
        // Only auto-move to bathroom if location not overridden
        if (!playerOverrides.location) {
          newState.location = 'home';
        }
        if (!playerOverrides.posture && s.posture === 'standing') {
          newState.posture = Math.random() > 0.5 ? 'walking' : 'standing';
        }
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
        }
      } else {
        newState.urethralFlow = 0;
      }

      // Heart rate and breathing
      const urgencyFactor = newState.urgeSignal / 100;
      newState.heartRate = 72 + urgencyFactor * 40 + (newState.sphincterTrembling ? 10 : 0);
      newState.breathingRate = 14 + urgencyFactor * 12;

      // Bladder training
      if (newState.bladderVolume > newState.maxCapacity * 0.9 && newState.urgeSignal > 100) {
        newState.trainingLevel = Math.min(5, newState.trainingLevel + simDt * 0.0001);
        newState.maxCapacity = Math.min(800, 500 + newState.trainingLevel * 60);
        newState.desensitizationLevel = Math.min(100, newState.desensitizationLevel + simDt * 0.001);
        newState.nerveSensitivity = Math.max(30, 100 - newState.desensitizationLevel * 0.7);
      }

      // Diuretic decay
      if (newState.simTime - newState.lastDrinkTime > 3600) {
        newState.diureticMultiplier = 1;
      }

      // Update AI (respects player overrides)
      newState = updateAI(newState, simDt, overridesRef.current);

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
    setState({ ...INITIAL_STATE, simTime: 8 * 3600 });
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
    setState(prev => ({
      ...INITIAL_STATE,
      ...overrides,
      simTime: overrides.simTime || 8 * 3600,
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
  };
}
