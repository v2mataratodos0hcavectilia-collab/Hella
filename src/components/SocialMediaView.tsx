import { SimulationState } from '../types';

interface SocialMediaViewProps {
  state: SimulationState;
}

export default function SocialMediaView({ state }: SocialMediaViewProps) {
  const formatTime = (simTime: number) => {
    const h = Math.floor(simTime / 3600) % 24;
    const m = Math.floor((simTime % 3600) / 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const fillRatio = state.bladderVolume / state.maxCapacity;
  const isBulging = fillRatio > 0.85;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-purple-950 via-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-800 flex flex-col">
      {/* Header */}
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

      {/* Live Stream View */}
      {state.isLiveStreaming && (
        <div className="bg-black border-b border-gray-700 p-4 shrink-0">
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Simulated camera view */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
            
            {/* Character silhouette */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-600 mb-2" />
              <div className="w-24 h-32 rounded-lg bg-gray-600 relative">
                {isBulging && (
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-gray-500 animate-pulse"
                    style={{ 
                      width: `${40 + fillRatio * 30}px`,
                      height: `${30 + fillRatio * 20}px`,
                      opacity: 0.8
                    }}
                  />
                )}
              </div>
            </div>

            {/* Live badge */}
            <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-bold text-white">
              🔴 LIVE
            </div>

            {/* Bladder indicator if bulging */}
            {isBulging && (
              <div className="absolute bottom-2 right-2 bg-yellow-600/90 px-2 py-1 rounded text-xs font-bold text-white">
                ⚠️ VISIBLE BULGE
              </div>
            )}
          </div>

          {/* Live chat simulation */}
          <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
            {state.liveViewerCount > 20 && (
              <div className="text-xs text-gray-400">💬 Viewer: omg is that a bladder bulge?? 😳</div>
            )}
            {fillRatio > 0.9 && (
              <div className="text-xs text-gray-400">💬 Viewer: she's SO full rn</div>
            )}
            {state.liveViewerCount > 30 && (
              <div className="text-xs text-gray-400">💬 Viewer: how is she holding that??</div>
            )}
          </div>
        </div>
      )}

      {/* Feed */}
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
    </div>
  );
}
