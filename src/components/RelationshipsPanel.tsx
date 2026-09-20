import { useState } from 'react';
import { SimulationState, Relationship } from '../types';

interface RelationshipsPanelProps {
  state: SimulationState;
}

export default function RelationshipsPanel({ state }: RelationshipsPanelProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'family' | 'romantic' | 'rival'>('friends');

  const getRelationships = (): Relationship[] => {
    switch (activeTab) {
      case 'friends': return state.friends;
      case 'family': return state.family;
      case 'romantic': return state.romanticInterest ? [state.romanticInterest] : [];
      case 'rival': return state.rival ? [state.rival] : [];
      default: return [];
    }
  };

  const relationships = getRelationships();

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-3">
      <div className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
        👥 Relationships
      </div>
      
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {(['friends', 'family', 'romantic', 'rival'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {tab === 'friends' && '👫'}
            {tab === 'family' && '👨‍👩‍👧'}
            {tab === 'romantic' && '💕'}
            {tab === 'rival' && '⚔️'}
          </button>
        ))}
      </div>
      
      {/* Relationships List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {relationships.length === 0 ? (
          <div className="text-xs text-gray-500 text-center py-4">
            No {activeTab} yet
          </div>
        ) : (
          relationships.map(rel => (
            <div key={rel.id} className="bg-gray-800/50 border border-gray-700 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-300">{rel.name}</span>
                <span className="text-[10px] text-gray-500 capitalize">{rel.type}</span>
              </div>
              
              {/* Closeness Bar */}
              <div className="mb-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-gray-400">Closeness:</span>
                  <span className="text-[10px] text-gray-300">{rel.closeness.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${rel.closeness}%` }}
                  />
                </div>
              </div>
              
              {/* Last Message Preview */}
              {rel.messages.length > 0 && (
                <div className="text-[10px] text-gray-400 italic truncate">
                  "{rel.messages[rel.messages.length - 1].content}"
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
