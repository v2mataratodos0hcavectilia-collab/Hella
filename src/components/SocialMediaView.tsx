import { useState } from 'react';
import { SimulationState, DRUG_PROPERTIES, DrugType } from '../types';

interface SocialMediaViewProps {
  state: SimulationState;
  setActiveTab: (tab: 'live' | 'posts' | 'recommendations' | 'explore' | 'personal' | 'chat') => void;
  setViewedProfile: (profile: string | null) => void;
  startSignup: (username: string) => void;
  makePlayerSuggestion: (content: string) => void;
}

export default function SocialMediaView({ state, setActiveTab, setViewedProfile, startSignup, makePlayerSuggestion }: SocialMediaViewProps) {
  const [liveChat, setLiveChat] = useState<Array<{ user: string; message: string; timestamp: number }>>([]);

  const formatTime = (simTime: number) => {
    const h = Math.floor(simTime / 3600) % 24;
    const m = Math.floor((simTime % 3600) / 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const fillRatio = state.bladderVolume / state.maxCapacity;
  const isBulging = fillRatio > 0.85;

  // Generate live chat messages
  if (state.isLiveStreaming && liveChat.length < 20) {
    const messages = [
      "omg is that a bladder bulge?? 😳",
      "she's SO full rn",
      "how is she holding that??",
      "live bladder cam is wild",
      "the way she's shifting 😩",
      "this is so relatable",
      "drink more water bestie 💧",
      "her face when the urge hits",
      "cross those legs tighter!",
      "I feel that in my soul",
      "bladder goals honestly",
      "the struggle is real",
    ];
    const users = ["BladderFan99", "UrgentVibes", "HoldingQueen", "PeePeePooPoo", "FullBladderClub", "DesperateDan"];
    
    if (Math.random() < 0.3) {
      setLiveChat(prev => [...prev, {
        user: users[Math.floor(Math.random() * users.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: state.simTime,
      }].slice(-20));
    }
  }

  const exploreUsers = [
    { name: "WaterLover", followers: "5.4K", posts: 234, verified: true },
    { name: "CoffeeAddict", followers: "15.7K", posts: 892, verified: false },
    { name: "TeaTime", followers: "3.2K", posts: 156, verified: false },
    { name: "SodaPop", followers: "9.8K", posts: 445, verified: true },
    { name: "JuiceBox", followers: "2.1K", posts: 89, verified: false },
    { name: "MilkMustache", followers: "7.6K", posts: 312, verified: false },
    { name: "SmoothieKing", followers: "11.4K", posts: 567, verified: true },
    { name: "HotChoc", followers: "4.9K", posts: 201, verified: false },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-purple-950 via-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-800 flex flex-col">
      {/* Header with tabs */}
      <div className="bg-gray-900/80 border-b border-gray-700 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">📱</span>
          <span className="text-sm font-bold text-white">BladderChat</span>
        </div>
        {state.isLiveStreaming && (
          <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full animate-pulse">
            <span className="text-xs font-bold text-white">🔴 LIVE</span>
            <span className="text-xs text-white">{state.liveViewerCount} watching</span>
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-700 bg-gray-900/50">
        {(['live', 'posts', 'recommendations', 'explore', 'chat', 'personal'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-xs font-bold uppercase transition-colors ${
              state.activeSocialTab === tab
                ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab === 'live' && '🔴 '}
            {tab === 'posts' && '📝 '}
            {tab === 'recommendations' && '⭐ '}
            {tab === 'explore' && '🔍 '}
            {tab === 'chat' && '💬 '}
            {tab === 'personal' && '👤 '}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* LIVE TAB */}
        {state.activeSocialTab === 'live' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {state.isLiveStreaming ? (
              <>
                {/* 2.5D Character View - Realistic Live Cam */}
                <div className="relative aspect-video bg-gradient-to-b from-gray-800 to-gray-900 shrink-0 overflow-hidden">
                  {/* Background environment based on location */}
                  <div className="absolute inset-0">
                    {state.location === 'home' && <div className="w-full h-full bg-gradient-to-b from-amber-900/20 to-gray-900" />}
                    {state.location === 'office' && <div className="w-full h-full bg-gradient-to-b from-blue-900/20 to-gray-900" />}
                    {state.location === 'car' && <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900" />}
                  </div>
                  
                  {/* Character body with realistic behavior */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`relative transition-all duration-500 ${
                      state.aiState === 'pacing' ? 'animate-pulse' : ''
                    } ${state.aiState === 'shifting_weight' ? 'animate-bounce' : ''}`}>
                      
                      {/* Head with facial expressions */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-b from-amber-200 to-amber-300 mx-auto mb-2 relative">
                        {/* Hair */}
                        <div className="absolute -top-2 left-0 right-0 h-8 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-full" />
                        
                        {/* Eyes - change based on urge */}
                        <div className={`absolute top-6 left-3 w-2 h-2 rounded-full ${
                          state.urgeSignal > 80 ? 'bg-red-600' : 
                          state.urgeSignal > 60 ? 'bg-orange-500' : 
                          'bg-gray-800'
                        }`} />
                        <div className={`absolute top-6 right-3 w-2 h-2 rounded-full ${
                          state.urgeSignal > 80 ? 'bg-red-600' : 
                          state.urgeSignal > 60 ? 'bg-orange-500' : 
                          'bg-gray-800'
                        }`} />
                        
                        {/* Eyebrows - furrowed when desperate */}
                        {state.urgeSignal > 70 && (
                          <>
                            <div className="absolute top-4 left-2 w-3 h-0.5 bg-gray-800 rotate-12" />
                            <div className="absolute top-4 right-2 w-3 h-0.5 bg-gray-800 -rotate-12" />
                          </>
                        )}
                        
                        {/* Mouth - changes with urge */}
                        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 ${
                          state.urgeSignal > 90 ? 'w-3 h-3 border-2 border-red-400 rounded-full' :
                          state.urgeSignal > 70 ? 'w-4 h-0.5 bg-red-400 rounded-full' :
                          state.urgeSignal > 50 ? 'w-4 h-1 bg-pink-400 rounded-full' :
                          'w-4 h-1 bg-pink-300 rounded-full'
                        }`} />
                        
                        {/* Sweat drops when very desperate */}
                        {state.urgeSignal > 85 && (
                          <>
                            <div className="absolute top-3 right-1 w-1 h-2 bg-blue-300 rounded-full animate-pulse" />
                            <div className="absolute top-5 left-1 w-1 h-2 bg-blue-300 rounded-full animate-pulse" />
                          </>
                        )}
                      </div>
                      
                      {/* Body with posture-based positioning */}
                      <div className={`w-24 h-32 bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg mx-auto relative overflow-hidden ${
                        state.aiState === 'crossing_legs' ? 'scale-95' : ''
                      }`}>
                        {/* Bladder bulge */}
                        {isBulging && (
                          <div 
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-400 to-purple-500 animate-pulse"
                            style={{ 
                              width: `${60 + fillRatio * 40}px`,
                              height: `${40 + fillRatio * 30}px`,
                              boxShadow: '0 0 20px rgba(200, 100, 255, 0.5)',
                            }}
                          />
                        )}
                        
                        {/* Arms - position based on behavior */}
                        <div className={`absolute -left-4 top-4 w-4 h-20 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full transition-all duration-300 ${
                          state.aiState === 'holding' ? 'rotate-12 translate-y-2' :
                          state.aiState === 'crossing_legs' ? 'rotate-45 translate-x-2' :
                          state.aiState === 'pacing' ? '-rotate-12' :
                          ''
                        }`} />
                        <div className={`absolute -right-4 top-4 w-4 h-20 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full transition-all duration-300 ${
                          state.aiState === 'holding' ? '-rotate-12 translate-y-2' :
                          state.aiState === 'crossing_legs' ? '-rotate-45 -translate-x-2' :
                          state.aiState === 'pacing' ? 'rotate-12' :
                          ''
                        }`} />
                        
                        {/* Hands on belly when holding */}
                        {state.aiState === 'holding' && state.urgeSignal > 70 && (
                          <>
                            <div className="absolute left-2 top-12 w-3 h-3 bg-amber-200 rounded-full" />
                            <div className="absolute right-2 top-12 w-3 h-3 bg-amber-200 rounded-full" />
                          </>
                        )}
                      </div>

                      {/* Legs - position based on behavior */}
                      <div className={`flex justify-center gap-2 mt-2 transition-all duration-300 ${
                        state.aiState === 'crossing_legs' ? 'scale-90 -rotate-6' :
                        state.aiState === 'shifting_weight' ? 'animate-pulse' :
                        ''
                      }`}>
                        <div className={`w-6 h-24 bg-gradient-to-b from-blue-600 to-blue-700 rounded-b-lg ${
                          state.aiState === 'crossing_legs' ? 'rotate-12 translate-x-2' : ''
                        }`} />
                        <div className={`w-6 h-24 bg-gradient-to-b from-blue-600 to-blue-700 rounded-b-lg ${
                          state.aiState === 'crossing_legs' ? '-rotate-12 -translate-x-2' : ''
                        }`} />
                      </div>
                    </div>
                  </div>

                  {/* Live badge */}
                  <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-bold text-white">
                    🔴 LIVE
                  </div>

                  {/* Bladder indicator */}
                  {isBulging && (
                    <div className="absolute top-2 right-2 bg-yellow-600/90 px-2 py-1 rounded text-xs font-bold text-white">
                      ⚠️ VISIBLE BULGE
                    </div>
                  )}

                  {/* Stats overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs font-mono">
                    <div className="bg-black/60 px-2 py-1 rounded">
                      💧 {state.bladderVolume.toFixed(0)}ml
                    </div>
                    <div className="bg-black/60 px-2 py-1 rounded">
                      ❤️ {state.heartRate.toFixed(0)} BPM
                    </div>
                  </div>
                </div>

                {/* Live donations */}
                {state.liveDonations.length > 0 && (
                  <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-t border-yellow-700/50 p-2 space-y-1">
                    <div className="text-xs text-yellow-400 font-bold mb-1">💰 Recent Donations</div>
                    {state.liveDonations.slice(0, 5).map((donation) => (
                      <div key={donation.id} className="text-xs flex items-center gap-2">
                        <span className={`font-bold ${donation.isMegaInfluencer ? 'text-yellow-300' : 'text-green-400'}`}>
                          {donation.isMegaInfluencer ? '⭐ ' : ''}{donation.viewer}
                        </span>
                        <span className="text-green-400">${donation.amount}</span>
                        <span className="text-gray-400 text-[10px]">{donation.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Live chat */}
                <div className="flex-1 overflow-y-auto bg-gray-900/50 p-2 space-y-1">
                  <div className="text-xs text-gray-500 mb-2">💬 Live Chat</div>
                  {liveChat.map((msg, i) => (
                    <div key={i} className="text-xs">
                      <span className="text-purple-400 font-bold">{msg.user}: </span>
                      <span className="text-gray-300">{msg.message}</span>
                    </div>
                  ))}
                  {liveChat.length === 0 && (
                    <div className="text-xs text-gray-500 text-center py-4">
                      Chat messages will appear here...
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                <div className="text-center">
                  <div className="text-4xl mb-2">📵</div>
                  <div>Not currently live</div>
                  <div className="text-xs mt-1">She'll go live when bladder is very full</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* POSTS TAB */}
        {state.activeSocialTab === 'posts' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {state.socialMediaPosts.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No posts yet. She'll start posting soon...
              </div>
            ) : (
              state.socialMediaPosts.map((post) => (
                <div
                  key={post.id}
                  className={`bg-gray-800/50 border rounded-lg p-3 ${
                    post.isFromUser ? 'border-purple-600/50' : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      post.isFromUser ? 'bg-purple-600' : 'bg-gray-600'
                    }`}>
                      {post.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${post.isFromUser ? 'text-purple-300' : 'text-gray-300'}`}>
                          @{post.author}
                        </span>
                        <span className="text-xs text-gray-500">{formatTime(post.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-200 mt-1">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* RECOMMENDATIONS TAB - Followers suggesting things */}
        {state.activeSocialTab === 'recommendations' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-xs text-gray-500 mb-2">💬 Followers suggest</div>
            {state.followerSuggestions.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-4">
                No suggestions yet. Keep streaming to get follower suggestions!
              </div>
            ) : (
              state.followerSuggestions.map((item) => (
                <div key={item.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                      {item.follower[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-blue-400 font-bold">@{item.follower}</div>
                      <div className="text-sm text-gray-200 mt-1">"{item.suggestion}"</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-[10px] text-gray-500">{Math.floor((state.simTime - item.timestamp) / 60)}m ago</div>
                      </div>
                      
                      {/* Response as comment */}
                      {item.responded && item.response && (
                        <div className="mt-2 ml-4 border-l-2 border-purple-500 pl-3">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-[10px]">
                              S
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-purple-300 font-bold">@Sarah_J</span>
                                <span className="text-[10px] text-gray-500">
                                  {item.responseTimestamp ? `${Math.floor((state.simTime - item.responseTimestamp) / 60)}m ago` : ''}
                                </span>
                              </div>
                              <div className="text-xs text-gray-300 mt-0.5">{item.response}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* EXPLORE TAB */}
        {state.activeSocialTab === 'explore' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {state.viewedProfile ? (
              // Profile View
              <div>
                <button
                  onClick={() => setViewedProfile(null)}
                  className="mb-3 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                >
                  ← Back to Explore
                </button>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
                      {state.viewedProfile[0]}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">@{state.viewedProfile}</div>
                      <div className="text-xs text-gray-400">
                        {exploreUsers.find(u => u.name === state.viewedProfile)?.followers || '0'} followers • {' '}
                        {exploreUsers.find(u => u.name === state.viewedProfile)?.posts || '0'} posts
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="text-xs text-gray-500 mb-2">Recent Posts</div>
                    {state.socialMediaPosts.filter(p => p.author === state.viewedProfile).slice(0, 5).map(post => (
                      <div key={post.id} className="bg-gray-900/50 rounded p-2 mb-2">
                        <div className="text-xs text-gray-300">{post.content}</div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          ❤️ {post.likes} • 💬 {post.comments} • {formatTime(post.timestamp)}
                        </div>
                      </div>
                    ))}
                    {state.socialMediaPosts.filter(p => p.author === state.viewedProfile).length === 0 && (
                      <div className="text-xs text-gray-500 text-center py-4">No posts yet</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Explore List
              <>
                <div className="text-xs text-gray-500 mb-2">🔍 Discover users</div>
                {exploreUsers.map((user, i) => (
                  <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {user.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">@{user.name}</span>
                          {user.verified && <span className="text-blue-400 text-xs">✓</span>}
                        </div>
                        <div className="text-xs text-gray-400">{user.followers} followers • {user.posts} posts</div>
                      </div>
                      <button 
                        onClick={() => setViewedProfile(user.name)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {state.activeSocialTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-gray-900/80 border-b border-gray-700 px-4 py-2 shrink-0">
              <div className="text-xs text-gray-400">💬 Group Chat - {state.chatMessages.length} messages</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {state.chatMessages.length === 0 ? (
                <div className="text-xs text-gray-500 text-center py-4">
                  No messages yet. Chat will appear here as users talk...
                </div>
              ) : (
                state.chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] ${
                      msg.isFromUser ? 'bg-purple-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    }`}>
                      {msg.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${msg.isFromUser ? 'text-purple-300' : 'text-blue-300'}`}>
                          @{msg.author}
                        </span>
                        <span className="text-[10px] text-gray-500">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="text-xs text-gray-300 mt-0.5">{msg.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
