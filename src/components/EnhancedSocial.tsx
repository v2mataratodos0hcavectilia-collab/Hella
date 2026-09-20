import { useState } from 'react';
import { SimulationState } from '../types';

interface EnhancedSocialProps {
  state: SimulationState;
}

interface Story {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  expiresAt: number;
  views: number;
}

interface DirectMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface TrendingTopic {
  id: string;
  tag: string;
  postCount: number;
  trending: boolean;
}

export default function EnhancedSocial({ state }: EnhancedSocialProps) {
  const [activeTab, setActiveTab] = useState<'stories' | 'messages' | 'trending'>('stories');
  const [stories, setStories] = useState<Story[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Generate stories based on game state
  const generateStories = () => {
    const newStories: Story[] = [];
    const now = state.simTime;
    
    // Her stories based on current state
    if (state.bladderVolume > state.maxCapacity * 0.8) {
      newStories.push({
        id: `story_${now}_1`,
        author: 'Sarah_J',
        content: 'Currently holding it like a champ! 💪 Who else is with me?',
        timestamp: now,
        expiresAt: now + 86400, // 24 hours
        views: Math.floor(Math.random() * 500) + 100,
      });
    }

    if (state.isLiveStreaming) {
      newStories.push({
        id: `story_${now}_2`,
        author: 'Sarah_J',
        content: '🔴 LIVE RIGHT NOW! Come watch the struggle!',
        timestamp: now,
        expiresAt: now + 86400,
        views: state.liveViewerCount,
      });
    }

    if (state.stressLevel > 70) {
      newStories.push({
        id: `story_${now}_3`,
        author: 'Sarah_J',
        content: 'Stress level through the roof today... 😫 Send help!',
        timestamp: now,
        expiresAt: now + 86400,
        views: Math.floor(Math.random() * 300) + 50,
      });
    }

    // Follower stories
    const followerStories = [
      { author: 'BladderFan99', content: 'Just hit a new personal record! 🏆' },
      { author: 'UrgentVibes', content: 'Anyone else doing the potty dance right now? 💃' },
      { author: 'HoldingQueen', content: 'Day 3 of the challenge! Still going strong! 💪' },
      { author: 'PeePeePooPoo', content: 'When you drink too much coffee but regret nothing ☕' },
    ];

    followerStories.forEach((story, i) => {
      if (Math.random() > 0.5) {
        newStories.push({
          id: `story_${now}_${i + 10}`,
          author: story.author,
          content: story.content,
          timestamp: now - Math.floor(Math.random() * 3600),
          expiresAt: now + 86400,
          views: Math.floor(Math.random() * 200) + 20,
        });
      }
    });

    setStories(newStories);
  };

  // Generate trending topics
  const generateTrendingTopics = () => {
    const topics: TrendingTopic[] = [
      { id: '1', tag: '#HoldingChallenge', postCount: 1247, trending: true },
      { id: '2', tag: '#BladderGoals', postCount: 892, trending: true },
      { id: '3', tag: '#PottyDance', postCount: 654, trending: false },
      { id: '4', tag: '#NoBathroom', postCount: 523, trending: true },
      { id: '5', tag: '#DesperateVibes', postCount: 445, trending: false },
      { id: '6', tag: '#FullBladderClub', postCount: 398, trending: true },
      { id: '7', tag: '#CoffeeOverdose', postCount: 312, trending: false },
      { id: '8', tag: '#StreamLife', postCount: 287, trending: true },
    ];
    setTrendingTopics(topics);
  };

  // Generate direct messages
  const generateMessages = () => {
    const newMessages: DirectMessage[] = [];
    const now = state.simTime;

    // Messages from followers
    const messageTemplates = [
      { from: 'BladderFan99', content: 'Hey! Love your streams! Keep it up! 💪' },
      { from: 'UrgentVibes', content: 'Want to collaborate on a holding challenge?' },
      { from: 'HoldingQueen', content: 'Your technique is amazing! Any tips?' },
      { from: 'PeePeePooPoo', content: 'Just tried your suggestion and it worked! Thanks!' },
    ];

    messageTemplates.forEach((msg, i) => {
      if (Math.random() > 0.6) {
        newMessages.push({
          id: `msg_${now}_${i}`,
          from: msg.from,
          to: 'Sarah_J',
          content: msg.content,
          timestamp: now - Math.floor(Math.random() * 7200),
          read: Math.random() > 0.5,
        });
      }
    });

    setMessages(newMessages);
  };

  // Initialize data
  useState(() => {
    generateStories();
    generateTrendingTopics();
    generateMessages();
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const msg: DirectMessage = {
      id: `msg_${state.simTime}_${Date.now()}`,
      from: 'Sarah_J',
      to: selectedUser,
      content: newMessage,
      timestamp: state.simTime,
      read: true,
    };

    setMessages([msg, ...messages]);
    setNewMessage('');
  };

  const unreadCount = messages.filter(m => !m.read && m.to === 'Sarah_J').length;

  return (
    <div className="bg-gray-900 border-t border-gray-700">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('stories')}
          className={`flex-1 px-4 py-2 text-sm font-bold transition-colors ${
            activeTab === 'stories'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          📸 Stories
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 px-4 py-2 text-sm font-bold transition-colors relative ${
            activeTab === 'messages'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          💬 Messages
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 px-4 py-2 text-sm font-bold transition-colors ${
            activeTab === 'trending'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          🔥 Trending
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="space-y-3">
            {stories.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No stories available
              </div>
            ) : (
              stories.map(story => (
                <div
                  key={story.id}
                  className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {story.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">@{story.author}</span>
                        <span className="text-xs text-gray-400">
                          {Math.floor((state.simTime - story.timestamp) / 60)}m ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{story.content}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        👁 {story.views} views
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No messages yet
              </div>
            ) : (
              <>
                {/* Message List */}
                <div className="space-y-2">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`bg-gray-800/50 border rounded-lg p-3 ${
                        !msg.read && msg.to === 'Sarah_J' ? 'border-blue-500/50' : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          msg.from === 'Sarah_J' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                          {msg.from[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">@{msg.from}</span>
                            <span className="text-xs text-gray-500">→</span>
                            <span className="text-xs font-bold text-white">@{msg.to}</span>
                            {!msg.read && msg.to === 'Sarah_J' && (
                              <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">New</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{msg.content}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.floor((state.simTime - msg.timestamp) / 60)}m ago
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Send Message */}
                {state.playerAccount.isSignedUp && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-2">Send Message</div>
                    <select
                      value={selectedUser || ''}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white mb-2"
                    >
                      <option value="">Select recipient...</option>
                      <option value="BladderFan99">@BladderFan99</option>
                      <option value="UrgentVibes">@UrgentVibes</option>
                      <option value="HoldingQueen">@HoldingQueen</option>
                      <option value="PeePeePooPoo">@PeePeePooPoo</option>
                    </select>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !selectedUser}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:bg-gray-700 disabled:text-gray-500"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div className="space-y-2">
            {trendingTopics.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No trending topics
              </div>
            ) : (
              trendingTopics.map(topic => (
                <div
                  key={topic.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-400">{topic.tag}</span>
                      {topic.trending && (
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">🔥 Hot</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {topic.postCount.toLocaleString()} posts
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded">
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
