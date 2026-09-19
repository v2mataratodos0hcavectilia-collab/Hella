import { SimulationState } from '../types';

interface SkillTreePanelProps {
  state: SimulationState;
  upgradeSkill: (tree: SkillTreeKey, skill: string, cost: number) => void;
}

type SkillTreeKey = 'bladderControl' | 'socialMedia' | 'career' | 'relationships';

export default function SkillTreePanel({ state, upgradeSkill }: SkillTreePanelProps) {
  const skillTrees = {
    bladderControl: {
      name: '💧 Bladder Control',
      color: 'blue',
      skills: [
        { id: 'capacity1', name: 'Capacity +50ml', description: 'Increase max capacity by 50ml', cost: 50, effect: () => state.maxCapacity + 50 },
        { id: 'capacity2', name: 'Capacity +100ml', description: 'Increase max capacity by 100ml', cost: 150, requires: 'capacity1', effect: () => state.maxCapacity + 100 },
        { id: 'control1', name: 'Better Control', description: 'Reduce sphincter fatigue by 20%', cost: 100, effect: () => state.sphincterFatigue * 0.8 },
        { id: 'endurance1', name: 'Endurance', description: 'Hold 30 seconds longer', cost: 75, effect: () => {} },
        { id: 'recovery1', name: 'Quick Recovery', description: 'Recover from fatigue 50% faster', cost: 125, requires: 'endurance1', effect: () => {} },
      ],
    },
    socialMedia: {
      name: '📱 Social Media',
      color: 'pink',
      skills: [
        { id: 'content1', name: 'Better Content', description: 'Posts get 20% more likes', cost: 75, effect: () => {} },
        { id: 'engagement1', name: 'Engagement', description: 'Gain followers 25% faster', cost: 100, requires: 'content1', effect: () => {} },
        { id: 'monetization1', name: 'Monetization', description: 'Donations increased by 30%', cost: 150, requires: 'engagement1', effect: () => {} },
        { id: 'viral1', name: 'Viral Potential', description: '5% chance for viral posts', cost: 200, requires: 'monetization1', effect: () => {} },
        { id: 'brand1', name: 'Brand Deals', description: 'Unlock sponsorship opportunities', cost: 300, requires: 'viral1', effect: () => {} },
      ],
    },
    career: {
      name: '💼 Career',
      color: 'green',
      skills: [
        { id: 'productivity1', name: 'Productivity', description: 'Work 20% more efficiently', cost: 100, effect: () => {} },
        { id: 'professionalism1', name: 'Professionalism', description: 'Better reputation at work', cost: 125, requires: 'productivity1', effect: () => {} },
        { id: 'promotion1', name: 'Promotion Track', description: 'Faster career progression', cost: 200, requires: 'professionalism1', effect: () => {} },
        { id: 'balance1', name: 'Work-Life Balance', description: 'Reduce work stress by 30%', cost: 150, effect: () => {} },
        { id: 'networking1', name: 'Networking', description: 'Better career opportunities', cost: 250, requires: 'promotion1', effect: () => {} },
      ],
    },
    relationships: {
      name: '❤️ Relationships',
      color: 'red',
      skills: [
        { id: 'empathy1', name: 'Empathy', description: 'Better understanding of others', cost: 75, effect: () => {} },
        { id: 'communication1', name: 'Communication', description: 'Clearer conversations', cost: 100, requires: 'empathy1', effect: () => {} },
        { id: 'trust1', name: 'Trust Building', description: 'Relationships grow 25% faster', cost: 150, requires: 'communication1', effect: () => {} },
        { id: 'conflict1', name: 'Conflict Resolution', description: 'Handle disagreements better', cost: 125, effect: () => {} },
        { id: 'charisma1', name: 'Charisma', description: 'More appealing personality', cost: 200, requires: 'trust1', effect: () => {} },
      ],
    },
  };

  const getTreeColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500 bg-blue-500/10';
      case 'pink': return 'border-pink-500 bg-pink-500/10';
      case 'green': return 'border-green-500 bg-green-500/10';
      case 'red': return 'border-red-500 bg-red-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getButtonColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-600 hover:bg-blue-500';
      case 'pink': return 'bg-pink-600 hover:bg-pink-500';
      case 'green': return 'bg-green-600 hover:bg-green-500';
      case 'red': return 'bg-red-600 hover:bg-red-500';
      default: return 'bg-gray-600 hover:bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">🌟 Skill Trees</h3>
        <div className="text-sm text-gray-400">
          Available Points: <span className="text-yellow-400 font-bold">{Math.floor(state.money)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(skillTrees).map(([treeKey, tree]) => (
          <div key={treeKey} className={`border-2 rounded-lg p-4 ${getTreeColor(tree.color)}`}>
            <h4 className="text-base font-bold text-white mb-3">{tree.name}</h4>
            <div className="space-y-2">
              {tree.skills.map((skill) => {
                const skillTree = state.skills[treeKey as keyof typeof state.skills];
                const isUnlocked = skillTree.level > 0; // Simplified check
                const canAfford = state.money >= skill.cost;
                const hasPrereq = !skill.requires || isUnlocked; // Simplified prereq check
                
                return (
                  <div
                    key={skill.id}
                    className={`p-2 rounded border ${
                      isUnlocked
                        ? 'border-green-500 bg-green-500/10'
                        : canAfford && hasPrereq
                        ? 'border-gray-600 bg-gray-800/50'
                        : 'border-gray-700 bg-gray-900/50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{skill.name}</span>
                      <span className="text-xs text-yellow-400">${skill.cost}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{skill.description}</div>
                    {skill.requires && (
                      <div className="text-[10px] text-gray-500 mb-2">
                        Requires: {tree.skills.find(s => s.id === skill.requires)?.name}
                      </div>
                    )}
                    {!isUnlocked && (
                      <button
                        onClick={() => canAfford && hasPrereq && upgradeSkill(treeKey as SkillTreeKey, skill.id, skill.cost)}
                        disabled={!canAfford || !hasPrereq}
                        className={`w-full px-2 py-1 rounded text-xs font-bold text-white ${
                          canAfford && hasPrereq
                            ? getButtonColor(tree.color)
                            : 'bg-gray-700 cursor-not-allowed'
                        }`}
                      >
                        {isUnlocked ? '✓ Unlocked' : !hasPrereq ? '🔒 Locked' : !canAfford ? '💰 Need Money' : '🔓 Unlock'}
                      </button>
                    )}
                    {isUnlocked && (
                      <div className="text-xs text-green-400 font-bold text-center">✓ Unlocked</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="text-xs text-gray-400">
          <strong className="text-white">💡 How it works:</strong> Spend money to unlock skills that provide permanent bonuses. 
          Some skills require prerequisites. Current controls are already unlocked and available!
        </div>
      </div>
    </div>
  );
}
