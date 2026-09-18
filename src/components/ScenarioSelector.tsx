import { Scenario, SimulationState } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'commute',
    name: 'The Commute',
    description: 'Stuck in the car for 2 hours. No bathroom access.',
    initialOverrides: {
      location: 'car',
      posture: 'sitting',
      aiState: 'commuting',
      bladderVolume: 200,
      distractionLevel: 30,
      temperature: 68,
      wardrobe: 'jeans',
      canAccessBathroom: false,
    },
  },
  {
    id: 'meeting',
    name: 'The Endless Meeting',
    description: 'Trapped in a boardroom. Can\'t leave without embarrassment.',
    initialOverrides: {
      location: 'meeting_room',
      posture: 'sitting',
      aiState: 'in_meeting',
      bladderVolume: 250,
      distractionLevel: 80,
      cognitiveState: 'focused',
      temperature: 74,
      wardrobe: 'dress',
    },
  },
  {
    id: 'elevator',
    name: 'The Broken Elevator',
    description: 'Trapped between floors. Help is on the way... eventually.',
    initialOverrides: {
      location: 'elevator',
      posture: 'standing',
      aiState: 'holding',
      bladderVolume: 350,
      distractionLevel: 10,
      cognitiveState: 'desperate',
      temperature: 78,
      wardrobe: 'overalls',
      canAccessBathroom: false,
    },
  },
  {
    id: 'morning',
    name: 'The Morning Rush',
    description: 'Trying to get ready for work. Bathroom is occupied.',
    initialOverrides: {
      location: 'home',
      posture: 'standing',
      aiState: 'idle',
      bladderVolume: 300,
      distractionLevel: 40,
      temperature: 70,
      wardrobe: 'leggings',
      simTime: 7 * 3600 + 30 * 60,
    },
  },
  {
    id: 'sandbox',
    name: 'Sandbox Mode',
    description: 'Full freedom. Everything starts normal. Explore at your own pace.',
    initialOverrides: {
      location: 'home',
      posture: 'standing',
      aiState: 'idle',
      bladderVolume: 50,
      distractionLevel: 20,
      temperature: 72,
      wardrobe: 'jeans',
      canAccessBathroom: true,
    },
  },
];

interface ScenarioSelectorProps {
  onSelect: (scenario: Scenario) => void;
  currentScenario: string | null;
}

export default function ScenarioSelector({ onSelect, currentScenario }: ScenarioSelectorProps) {
  return (
    <div className="bg-gray-900/95 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider whitespace-nowrap">
          SCENARIOS:
        </span>
        {SCENARIOS.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-all ${
              currentScenario === scenario.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
            title={scenario.description}
          >
            {scenario.name}
          </button>
        ))}
      </div>
    </div>
  );
}
