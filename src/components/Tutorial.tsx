import { useState } from 'react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  icon: string;
  highlight?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to The Vessel',
    content: 'This is a biological sandbox simulation where you control a character\'s bladder and daily life. There are no win/loss conditions - just pure sandbox freedom!',
    icon: '👋',
  },
  {
    id: 'views',
    title: 'View Modes',
    content: 'Use the buttons at the top to switch between different views:\n• 🔬 Micro - See internal bladder anatomy\n• 👁 Macro - Watch your character in 3D\n• ⬡ Split - Both views at once\n• 📱 Social - Social media platform\n• ❤️ Heart - Heart visualization\n• 🫁 Lungs - Lung visualization\n• 🍽️ Stomach - Stomach visualization\n• 🏆 Achievements - Track your progress',
    icon: '👁',
  },
  {
    id: 'control-panel',
    title: 'Control Panel',
    content: 'The right panel contains all your god-mode controls:\n• Urge Signal - Override how urgent she feels\n• Sphincter Control - Lock/unlock muscles\n• Urethral Valve - Control flow (drip/leak/release)\n• Fill Rate - Adjust kidney production\n• Time Speed - Speed up simulation (1× to 150×)',
    icon: '🎛',
  },
  {
    id: 'bladder-basics',
    title: 'Bladder Basics',
    content: 'Your character\'s bladder fills naturally over time. Watch the stats at the bottom:\n• Volume (ml) - Current bladder content\n• Pressure (cmH₂O) - Internal pressure\n• Urge Signal (%) - How badly she needs to go\n• Capacity (ml) - Maximum bladder size\n\nWhen volume reaches capacity, she becomes desperate!',
    icon: '💧',
  },
  {
    id: 'vitals',
    title: 'Vital Signs',
    content: 'Monitor her health with vital signs:\n• Heart Rate (BPM) - Beats per minute\n• Breathing Rate (BrPM) - Breaths per minute\n• Blood Pressure (mmHg) - Systolic pressure\n• Blood O₂ (%) - Oxygen saturation\n• Consciousness (%) - Awareness level\n\nExtreme values can cause pass out or death!',
    icon: '❤️',
  },
  {
    id: 'nanobots',
    title: 'Nanobot Control',
    content: 'Inject nanobots to gain direct control over her vitals:\n• Heart Rate - Set exact BPM (0-400)\n• Breathing Rate - Set exact BrPM (0-50)\n• Heart Beat Strength - Control pulse power\n• Breath Deepness - Control breath volume\n\n⚠️ Warning: 0 BPM or 0 BrPM = instant death!',
    icon: '🤖',
  },
  {
    id: 'drugs',
    title: 'Drug System',
    content: 'Administer various drugs with different effects:\n• Stimulants - Increase heart rate, suppress urge\n• Depressants - Relax muscles, reduce awareness\n• Opioids - Strong suppression, high overdose risk\n• Hallucinogens - Alter perception\n• Diuretics - Increase fill rate dramatically\n\nEach drug has unique effects and overdose risks!',
    icon: '💊',
  },
  {
    id: 'food-drinks',
    title: 'Food & Drinks',
    content: 'Control her intake with 40+ options:\n• Water & Basics - Normal hydration\n• Juices - Various fill rates\n• Hot Drinks - Coffee, tea, etc.\n• Alcohol - Suppresses urge awareness\n• Diuretic Foods - Watermelon, asparagus\n• Spicy Foods - Increase urgency\n\nEach item has unique effects on bladder and stress!',
    icon: '🍽',
  },
  {
    id: 'social-media',
    title: 'Social Media',
    content: 'She has an active social media presence:\n• 🔴 Live - Stream when bladder is full\n• 📝 Posts - AI generates content\n• ⭐ Recommendations - Followers suggest challenges\n• 🔍 Explore - Discover other users\n• 💬 Chat - Group conversations\n• 👤 Personal - Your account (signup required)',
    icon: '📱',
  },
  {
    id: 'personal-account',
    title: 'Personal Account',
    content: 'Create your own account to interact:\n• Sign up with preset name (vec, hella, sheen, neko)\n• Post comments on her content\n• Make suggestions she might follow\n• Track your suggestions\' acceptance\n\nYou must sign up before posting!',
    icon: '👤',
  },
  {
    id: 'training',
    title: 'Bladder Training',
    content: 'Increase her capacity through training:\n• Keep bladder at 100%+ capacity\n• Training speed: 1× to 100×\n• Max level: 100\n• Max capacity: 2300ml\n• Bulging (>100%) trains 2× faster\n\nTraining is independent from urge signal!',
    icon: '🎯',
  },
  {
    id: 'traits',
    title: 'Character Traits',
    content: 'Toggle special traits to change behavior:\n• Full Bladder Preference - She enjoys being full, anxious when empty\n\nThis trait makes her:\n• Calm and clear-thinking when full\n• Anxious and stressed when empty\n• More likely to go live when full',
    icon: '✨',
  },
  {
    id: 'scenarios',
    title: 'Scenarios',
    content: 'Start with preset situations:\n• The Commute - Stuck in car for 2 hours\n• The Endless Meeting - Trapped in boardroom\n• The Broken Elevator - Stuck between floors\n• The Morning Rush - Getting ready for work\n• Sandbox Mode - Full freedom\n\nOr create custom scenarios with advanced options!',
    icon: '🎬',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    content: 'Unlock 20+ achievements across categories:\n• Bladder Milestones - Capacity goals\n• Time Milestones - Hold duration\n• Social Milestones - Follower counts\n• Drug Milestones - Experimentation\n• Training Milestones - Level progression\n• Money Milestones - Earnings goals\n\nEach achievement rewards $1-20!',
    icon: '🏆',
  },
  {
    id: 'tips',
    title: 'Pro Tips',
    content: '• Use time speed (60×-150×) to fast-forward\n• Check predictions to plan bathroom breaks\n• Monitor vitals to avoid pass out/death\n• Combine drugs carefully to avoid overdose\n• Full bladder trait makes high urge enjoyable\n• Swipe to scroll in achievements and personal account\n• No save/load - use reset to start fresh',
    icon: '💡',
  },
];

interface TutorialProps {
  onComplete: () => void;
}

export default function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{step.icon}</div>
            <div>
              <h2 className="text-xl font-bold text-white">{step.title}</h2>
              <div className="text-xs text-gray-400">
                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
              </div>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white text-sm"
          >
            Skip Tutorial
          </button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          <div className="text-gray-300 whitespace-pre-line leading-relaxed">
            {step.content}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
          >
            {isLastStep ? 'Finish ✓' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
