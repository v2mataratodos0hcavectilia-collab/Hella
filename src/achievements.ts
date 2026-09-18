export interface Achievement {
  id: string;
  name: string;
  description: string;
  reward: number;
  check: (state: any) => boolean;
  getProgress?: (state: any) => number;
  getMaxProgress?: () => number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Bladder milestones
  {
    id: 'first_500',
    name: 'First 500ml',
    description: 'Reach 500ml bladder capacity',
    reward: 5,
    check: (state) => state.bladderVolume >= 500,
    getProgress: (state) => state.bladderVolume,
    getMaxProgress: () => 500,
  },
  {
    id: 'capacity_800',
    name: 'Expanding Horizons',
    description: 'Reach 800ml bladder capacity',
    reward: 10,
    check: (state) => state.maxCapacity >= 800,
    getProgress: (state) => state.maxCapacity,
    getMaxProgress: () => 800,
  },
  {
    id: 'capacity_1000',
    name: 'Thousand Club',
    description: 'Reach 1000ml bladder capacity',
    reward: 15,
    check: (state) => state.maxCapacity >= 1000,
    getProgress: (state) => state.maxCapacity,
    getMaxProgress: () => 1000,
  },
  
  // Time milestones
  {
    id: 'hold_1hr',
    name: 'Patient Holder',
    description: 'Hold for 1 hour continuously',
    reward: 5,
    check: (state) => state.bladderVolume > 0 && (state.simTime - state.lastVoidTime) >= 3600,
    getProgress: (state) => state.simTime - state.lastVoidTime,
    getMaxProgress: () => 3600,
  },
  {
    id: 'hold_4hr',
    name: 'Iron Will',
    description: 'Hold for 4 hours continuously',
    reward: 10,
    check: (state) => state.bladderVolume > 0 && (state.simTime - state.lastVoidTime) >= 14400,
    getProgress: (state) => state.simTime - state.lastVoidTime,
    getMaxProgress: () => 14400,
  },
  {
    id: 'hold_8hr',
    name: 'Legendary Endurance',
    description: 'Hold for 8 hours continuously',
    reward: 20,
    check: (state) => state.bladderVolume > 0 && (state.simTime - state.lastVoidTime) >= 28800,
    getProgress: (state) => state.simTime - state.lastVoidTime,
    getMaxProgress: () => 28800,
  },
  
  // Social milestones
  {
    id: 'first_stream',
    name: 'Going Live',
    description: 'Go live for the first time',
    reward: 5,
    check: (state) => state.totalStreams >= 1,
    getProgress: (state) => state.totalStreams,
    getMaxProgress: () => 1,
  },
  {
    id: 'followers_50',
    name: 'Rising Star',
    description: 'Reach 50 followers',
    reward: 10,
    check: (state) => state.followerCount >= 50,
    getProgress: (state) => state.followerCount,
    getMaxProgress: () => 50,
  },
  {
    id: 'followers_200',
    name: 'Influencer',
    description: 'Reach 200 followers',
    reward: 15,
    check: (state) => state.followerCount >= 200,
    getProgress: (state) => state.followerCount,
    getMaxProgress: () => 200,
  },
  {
    id: 'followers_500',
    name: 'Social Media Star',
    description: 'Reach 500 followers',
    reward: 20,
    check: (state) => state.followerCount >= 500,
    getProgress: (state) => state.followerCount,
    getMaxProgress: () => 500,
  },
  
  // Drug milestones
  {
    id: 'first_drug',
    name: 'Experimental',
    description: 'Take your first drug',
    reward: 5,
    check: (state) => state.totalDrugsTaken >= 1,
    getProgress: (state) => state.totalDrugsTaken,
    getMaxProgress: () => 1,
  },
  {
    id: 'all_stimulants',
    name: 'Stimulated',
    description: 'Try all stimulant drugs',
    reward: 10,
    check: (state) => state.drugsTried.includes('caffeine') && state.drugsTried.includes('adderall') && state.drugsTried.includes('ritalin'),
  },
  {
    id: 'survived_overdose',
    name: 'Near Death Experience',
    description: 'Survive an overdose',
    reward: 15,
    check: (state) => state.overdosesSurvived >= 1,
    getProgress: (state) => state.overdosesSurvived,
    getMaxProgress: () => 1,
  },
  
  // Training milestones
  {
    id: 'training_10',
    name: 'Dedicated Trainer',
    description: 'Reach training level 10',
    reward: 10,
    check: (state) => state.trainingLevel >= 10,
    getProgress: (state) => state.trainingLevel,
    getMaxProgress: () => 10,
  },
  {
    id: 'training_20',
    name: 'Master Trainer',
    description: 'Reach training level 20',
    reward: 15,
    check: (state) => state.trainingLevel >= 20,
    getProgress: (state) => state.trainingLevel,
    getMaxProgress: () => 20,
  },
  {
    id: 'training_30',
    name: 'Perfect Control',
    description: 'Reach maximum training level 30',
    reward: 20,
    check: (state) => state.trainingLevel >= 30,
    getProgress: (state) => state.trainingLevel,
    getMaxProgress: () => 30,
  },
  
  // Money milestones
  {
    id: 'earned_100',
    name: 'First Hundred',
    description: 'Earn $100 total',
    reward: 5,
    check: (state) => state.totalEarned >= 100,
    getProgress: (state) => state.totalEarned,
    getMaxProgress: () => 100,
  },
  {
    id: 'earned_500',
    name: 'Making Bank',
    description: 'Earn $500 total',
    reward: 10,
    check: (state) => state.totalEarned >= 500,
    getProgress: (state) => state.totalEarned,
    getMaxProgress: () => 500,
  },
  {
    id: 'earned_1000',
    name: 'Thousandaire',
    description: 'Earn $1000 total',
    reward: 15,
    check: (state) => state.totalEarned >= 1000,
    getProgress: (state) => state.totalEarned,
    getMaxProgress: () => 1000,
  },
];
