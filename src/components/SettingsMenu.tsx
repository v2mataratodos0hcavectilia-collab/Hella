import { useState } from 'react';

export interface Settings {
  audioEnabled: boolean;
  heartbeatAudio: boolean;
  breathingAudio: boolean;
  notificationsEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  timeSpeed: number;
  showPredictions: boolean;
  autoPlay: boolean;
  colorblindMode: boolean;
  textSize: 'small' | 'medium' | 'large';
}

interface SettingsMenuProps {
  settings: Settings;
  onSettingsChange: (settings: Settings | ((prev: Settings) => Settings)) => void;
  onClose: () => void;
}

export default function SettingsMenu({ settings, onSettingsChange, onClose }: SettingsMenuProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleToggle = (key: keyof Settings) => {
    const newSettings = {
      ...localSettings,
      [key]: !localSettings[key],
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleSelect = (key: keyof Settings, value: any) => {
    const newSettings = {
      ...localSettings,
      [key]: value,
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Audio Settings */}
          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">🔊 Audio</h3>
            <div className="space-y-2">
              <ToggleOption
                label="Master Audio"
                enabled={localSettings.audioEnabled}
                onToggle={() => handleToggle('audioEnabled')}
              />
              {localSettings.audioEnabled && (
                <>
                  <ToggleOption
                    label="Heartbeat Sound"
                    enabled={localSettings.heartbeatAudio}
                    onToggle={() => handleToggle('heartbeatAudio')}
                    description="Hear your heart rate increase with stress"
                  />
                  <ToggleOption
                    label="Breathing Sound"
                    enabled={localSettings.breathingAudio}
                    onToggle={() => handleToggle('breathingAudio')}
                    description="Audio feedback for breathing rate"
                  />
                </>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">🔔 Notifications</h3>
            <div className="space-y-2">
              <ToggleOption
                label="Social Media Notifications"
                enabled={localSettings.notificationsEnabled}
                onToggle={() => handleToggle('notificationsEnabled')}
                description="Get alerts for new posts, comments, and followers"
              />
            </div>
          </div>

          {/* Gameplay */}
          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">🎮 Gameplay</h3>
            <div className="space-y-2">
              <SelectOption
                label="Difficulty"
                value={localSettings.difficulty}
                options={[
                  { value: 'easy', label: 'Easy - Relaxed pace' },
                  { value: 'normal', label: 'Normal - Balanced' },
                  { value: 'hard', label: 'Hard - Intense challenge' },
                ]}
                onChange={(value) => handleSelect('difficulty', value)}
              />
              <ToggleOption
                label="Show Predictions"
                enabled={localSettings.showPredictions}
                onToggle={() => handleToggle('showPredictions')}
                description="AI predicts when you'll need to use the bathroom"
              />
              <ToggleOption
                label="Auto-Play Mode"
                enabled={localSettings.autoPlay}
                onToggle={() => handleToggle('autoPlay')}
                description="Let AI handle some decisions automatically"
              />
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">♿ Accessibility</h3>
            <div className="space-y-2">
              <ToggleOption
                label="Colorblind Mode"
                enabled={localSettings.colorblindMode}
                onToggle={() => handleToggle('colorblindMode')}
                description="Alternative color schemes for better visibility"
              />
              <SelectOption
                label="Text Size"
                value={localSettings.textSize}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
                onChange={(value) => handleSelect('textSize', value)}
              />
            </div>
          </div>

          {/* Info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <h3 className="text-sm font-bold text-gray-300 mb-2">ℹ️ About</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Version: 4.1.1</div>
              <div>Note: Reset button wipes all progress except leaderboard</div>
              <div>Mobile optimized for touch controls</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleOption({ label, enabled, onToggle, description }: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded">
      <div className="flex-1">
        <div className="text-sm text-white">{label}</div>
        {description && <div className="text-xs text-gray-400">{description}</div>}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function SelectOption({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded">
      <div className="text-sm text-white">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
