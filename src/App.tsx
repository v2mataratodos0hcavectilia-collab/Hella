import { useState, useCallback, useEffect } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { useAudio } from './hooks/useAudio';
import MicroView from './components/MicroView';
import MacroView from './components/MacroView';
import ControlPanel from './components/ControlPanel';
import StatsPanel from './components/StatsPanel';
import ScenarioSelector from './components/ScenarioSelector';
import AILog from './components/AILog';
import SocialMediaView from './components/SocialMediaView';
import HeartView from './components/HeartView';
import AchievementsPanel from './components/AchievementsPanel';
import PlayerAccountPanel from './components/PlayerAccountPanel';
import WeatherPanel from './components/WeatherPanel';
import RelationshipsPanel from './components/RelationshipsPanel';
import TrainingPanel from './components/TrainingPanel';
import { Scenario } from './types';

function CollapsibleBottomPanel({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="px-1 pb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 mb-1 flex items-center justify-between hover:bg-gray-700/80 transition-colors"
      >
        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{title}</span>
        <span className="text-gray-500">{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && (
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-2">
          {children}
        </div>
      )}
    </div>
  );
}

function App() {
  const {
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
  } = useSimulation();

  const { initAudio } = useAudio(state.heartRate, state.breathingRate, state.isPaused);
  const [activeView, setActiveView] = useState<'micro' | 'macro' | 'split' | 'social' | 'heart' | 'achievements'>('split');
  const [currentScenario, setCurrentScenario] = useState<string | null>('sandbox');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  const handleScenarioSelect = useCallback((scenario: Scenario) => {
    setCurrentScenario(scenario.id);
    loadScenario(scenario.initialOverrides);
  }, [loadScenario]);

  const handleEnableAudio = useCallback(() => {
    initAudio();
    setAudioEnabled(true);
  }, [initAudio]);

  const handlePlayerPost = useCallback((content: string) => {
    playerPost(content);
  }, [playerPost]);

  const handlePlayerComment = useCallback((postId: string, content: string) => {
    playerComment(postId, content);
  }, [playerComment]);

  useEffect(() => {
    const timer = setTimeout(() => setShowHelp(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-red-400">THE</span>{' '}
            <span className="text-white">VESSEL</span>
          </h1>
          <span className="text-xs text-gray-500 font-mono">Internal Sandbox v1.0</span>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveView('micro')}
              className={`px-3 py-1 text-xs font-mono ${activeView === 'micro' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              🔬 Micro
            </button>
            <button
              onClick={() => setActiveView('macro')}
              className={`px-3 py-1 text-xs font-mono ${activeView === 'macro' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              👁 Macro
            </button>
            <button
              onClick={() => setActiveView('split')}
              className={`px-3 py-1 text-xs font-mono ${activeView === 'split' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              ⬡ Split
            </button>
            <button
              onClick={() => setActiveView('social')}
              className={`px-3 py-1 text-xs font-mono ${activeView === 'social' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              📱 Social
            </button>
            <button
              onClick={() => setActiveView('heart')}
              className={`px-3 py-1 text-xs font-mono ${activeView === 'heart' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              ❤️ Heart
            </button>
            <button
              onClick={() => setActiveView('achievements')}
              className={`px-3 py-1 text-xs font-mono ${activeView === 'achievements' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              🏆 Achievements
            </button>
          </div>
          {/* Audio Toggle */}
          <button
            onClick={handleEnableAudio}
            className={`px-3 py-1 text-xs font-mono rounded ${audioEnabled ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
          >
            {audioEnabled ? '🔊 Audio ON' : '🔇 Enable Audio'}
          </button>
        </div>
      </header>

      {/* Scenario Selector */}
      <ScenarioSelector onSelect={handleScenarioSelect} currentScenario={currentScenario} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {activeView === 'split' ? (
              <>
                <div className="flex-1 p-1">
                  <MicroView state={state} />
                </div>
                <div className="flex-1 p-1">
                  <MacroView state={state} />
                </div>
              </>
            ) : activeView === 'micro' ? (
              <div className="flex-1 p-1">
                <MicroView state={state} />
              </div>
            ) : activeView === 'macro' ? (
              <div className="flex-1 p-1">
                <MacroView state={state} />
              </div>
            ) : activeView === 'social' ? (
              <div className="flex-1 p-1">
                <SocialMediaView state={state} setActiveTab={setActiveSocialTab} setViewedProfile={setViewedProfile} />
              </div>
            ) : activeView === 'heart' ? (
              <div className="flex-1 p-1">
                <HeartView state={state} />
              </div>
            ) : (
              <div className="flex-1 p-1">
                <AchievementsPanel state={state} />
              </div>
            )}
          </div>

          {/* AI Log */}
          <div className="px-1 pb-1">
            <AILog state={state} />
          </div>

          {/* New Feature Panels - Collapsible */}
          <CollapsibleBottomPanel title="🌍 Environment & Relationships & Training">
            <div className="grid grid-cols-3 gap-1">
              <WeatherPanel state={state} />
              <RelationshipsPanel state={state} />
              <TrainingPanel 
                state={state} 
                setTrainingMethod={setTrainingMethod}
                toggleBladderControlMode={toggleBladderControlMode}
              />
            </div>
          </CollapsibleBottomPanel>

          {/* Stats Bar */}
          <StatsPanel state={state} />

          {/* Player Account Panel (only show when on social view) */}
          {activeView === 'social' && state.activeSocialTab === 'personal' && (
            <PlayerAccountPanel
              state={state}
              onPost={handlePlayerPost}
              onComment={handlePlayerComment}
              onExit={() => setActiveSocialTab('posts')}
            />
          )}
        </div>

        {/* Control Panel */}
        <div className="w-80 shrink-0 overflow-hidden">
          <ControlPanel
            state={state}
            overrides={overrides}
            setUrgeSignal={setUrgeSignal}
            setFalseAlarm={setFalseAlarm}
            setSphincterLock={setSphincterLock}
            setUrethralValve={setUrethralValve}
            setFillRate={setFillRate}
            setTimeSpeed={setTimeSpeed}
            togglePause={togglePause}
            resetSimulation={resetSimulation}
            setTemperature={setTemperature}
            setWardrobe={setWardrobe}
            setPosture={setPosture}
            setLocation={setLocation}
            setDistraction={setDistraction}
            setSleepWakeSignal={setSleepWakeSignal}
            manualReset={manualReset}
            giveDrink={giveDrink}
            giveDrug={giveDrug}
            setTrainingSpeed={setTrainingSpeed}
            toggleFullBladderPreference={toggleFullBladderPreference}
            setHeartRateControl={setHeartRateControl}
            setBreathingControl={setBreathingControl}
            toggleNanobots={toggleNanobots}
          />
        </div>
      </div>

      {/* Help Overlay */}
      {showHelp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 pointer-events-none">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-lg shadow-2xl pointer-events-auto">
            <h2 className="text-xl font-bold text-white mb-3">Welcome to The Vessel</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p>🔬 <strong>Micro View:</strong> 3D cross-section of the internal urinary tract. Watch the bladder expand, ureters drip, and sphincters tense.</p>
              <p>👁 <strong>Macro View:</strong> Observe her AI navigate daily life — drinking, working, holding, pacing.</p>
              <p>🎛 <strong>Control Panel:</strong> God-mode controls over her bladder, sphincter, urge signals, and environment.</p>
              <p>⏱ <strong>Time:</strong> 1× speed = 5 real minutes per sim hour. Use speed controls to fast-forward.</p>
              <p className="text-gray-500 text-xs mt-3">No win states. No progression. Pure sandbox. Click anywhere to dismiss.</p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-bold"
            >
              Begin Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
