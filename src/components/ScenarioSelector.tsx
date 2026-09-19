import { useState } from 'react';
import { Scenario, SimulationState, WeatherType, SeasonType, LocationType, Posture, WardrobeType } from '../types';

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

function CustomScenarioModal({ onClose, onCreate }: { onClose: () => void; onCreate: (scenario: Scenario) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bladderVolume, setBladderVolume] = useState(200);
  const [location, setLocation] = useState<LocationType>('home');
  const [posture, setPosture] = useState<Posture>('standing');
  const [wardrobe, setWardrobe] = useState<WardrobeType>('jeans');
  const [temperature, setTemperature] = useState(72);
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [distractionLevel, setDistractionLevel] = useState(30);
  const [canAccessBathroom, setCanAccessBathroom] = useState(true);

  const handleCreate = () => {
    if (!name.trim()) return;
    
    const scenario: Scenario = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom scenario',
      initialOverrides: {
        bladderVolume,
        location,
        posture,
        wardrobe,
        temperature,
        weather,
        distractionLevel,
        canAccessBathroom,
      },
    };
    
    onCreate(scenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create Custom Scenario</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Name & Description */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Scenario Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
              placeholder="My Custom Scenario"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
              placeholder="Describe your scenario..."
              rows={2}
            />
          </div>

          {/* Bladder Volume */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Bladder Volume: {bladderVolume}ml
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={bladderVolume}
              onChange={(e) => setBladderVolume(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as LocationType)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="car">Car</option>
              <option value="bathroom">Bathroom</option>
              <option value="bedroom">Bedroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="meeting_room">Meeting Room</option>
              <option value="elevator">Elevator</option>
            </select>
          </div>

          {/* Posture */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Posture</label>
            <select
              value={posture}
              onChange={(e) => setPosture(e.target.value as Posture)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
            >
              <option value="standing">Standing</option>
              <option value="sitting">Sitting</option>
              <option value="walking">Walking</option>
              <option value="running">Running</option>
              <option value="lying_down">Lying Down</option>
            </select>
          </div>

          {/* Wardrobe */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Wardrobe</label>
            <select
              value={wardrobe}
              onChange={(e) => setWardrobe(e.target.value as WardrobeType)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
            >
              <option value="skirt">Skirt</option>
              <option value="dress">Dress</option>
              <option value="leggings">Leggings</option>
              <option value="jeans">Jeans</option>
              <option value="overalls">Overalls</option>
              <option value="jumpsuit">Jumpsuit</option>
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Temperature: {temperature}°F ({Math.round((temperature - 32) * 5/9)}°C)
            </label>
            <input
              type="range"
              min="30"
              max="120"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Weather */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Weather</label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value as WeatherType)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
            >
              <option value="clear">Clear</option>
              <option value="cloudy">Cloudy</option>
              <option value="rainy">Rainy</option>
              <option value="snowy">Snowy</option>
              <option value="stormy">Stormy</option>
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
            </select>
          </div>

          {/* Distraction Level */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Distraction Level: {distractionLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={distractionLevel}
              onChange={(e) => setDistractionLevel(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Can Access Bathroom */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="canAccessBathroom"
              checked={canAccessBathroom}
              onChange={(e) => setCanAccessBathroom(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="canAccessBathroom" className="text-sm text-gray-300">
              Can Access Bathroom
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded"
          >
            Create Scenario
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScenarioSelector({ onSelect, currentScenario }: ScenarioSelectorProps) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customScenarios, setCustomScenarios] = useState<Scenario[]>([]);

  const handleCreateCustom = (scenario: Scenario) => {
    setCustomScenarios([...customScenarios, scenario]);
    onSelect(scenario);
  };

  return (
    <>
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
          
          {/* Custom Scenarios */}
          {customScenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-all ${
                currentScenario === scenario.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-800 text-purple-400 hover:bg-gray-700 hover:text-purple-200'
              }`}
              title={scenario.description}
            >
              ⭐ {scenario.name}
            </button>
          ))}
          
          {/* Create Custom Scenario Button */}
          <button
            onClick={() => setShowCustomModal(true)}
            className="px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap bg-gray-800 text-green-400 hover:bg-gray-700 hover:text-green-300 border border-green-700/50"
            title="Create a custom scenario"
          >
            + Custom
          </button>
        </div>
      </div>

      {showCustomModal && (
        <CustomScenarioModal
          onClose={() => setShowCustomModal(false)}
          onCreate={handleCreateCustom}
        />
      )}
    </>
  );
}
