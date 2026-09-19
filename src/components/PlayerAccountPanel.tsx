import { useState } from 'react';
import { SimulationState, SocialMediaPost, SocialMediaComment } from '../types';

interface PlayerAccountPanelProps {
  state: SimulationState;
  onPost: (content: string) => void;
  onComment: (postId: string, content: string) => void;
  onExit: () => void;
  startSignup: (username: string) => void;
  makePlayerSuggestion: (content: string) => void;
}

export default function PlayerAccountPanel({ state, onPost, onComment, onExit, startSignup, makePlayerSuggestion }: PlayerAccountPanelProps) {
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [signupUsername, setSignupUsername] = useState('');
  const [newSuggestion, setNewSuggestion] = useState('');
  const [signupStep, setSignupStep] = useState(0); // 0: name selection, 1: auto-fill, 2: confirm
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [autoFillData, setAutoFillData] = useState({
    email: '',
    bio: '',
    avatar: '',
  });

  const handlePost = () => {
    if (newPostContent.trim()) {
      onPost(newPostContent.trim());
      setNewPostContent('');
    }
  };

  const handleComment = (postId: string) => {
    const content = commentInputs[postId];
    if (content && content.trim()) {
      onComment(postId, content.trim());
      setCommentInputs({ ...commentInputs, [postId]: '' });
    }
  };

  const handleSignup = () => {
    if (signupUsername.trim()) {
      startSignup(signupUsername.trim());
    }
  };

  const handleMakeSuggestion = () => {
    if (newSuggestion.trim()) {
      makePlayerSuggestion(newSuggestion.trim());
      setNewSuggestion('');
    }
  };

  const formatTime = (simTime: number) => {
    const hours = Math.floor(simTime / 3600) % 24;
    const minutes = Math.floor((simTime % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Signup screen - always show at top if not signed up
  if (!state.playerAccount.isSignedUp) {
    const presetNames = [
      { name: 'vec', emoji: '⚡', color: 'from-blue-500 to-cyan-500' },
      { name: 'hella', emoji: '🔥', color: 'from-orange-500 to-red-500' },
      { name: 'sheen', emoji: '✨', color: 'from-purple-500 to-pink-500' },
      { name: 'neko', emoji: '🐱', color: 'from-pink-500 to-rose-500' },
    ];

    const handlePresetSelect = (preset: string) => {
      setSelectedPreset(preset);
      setSignupStep(1);
      // Auto-generate profile data
      setAutoFillData({
        email: `${preset}@bladderchat.com`,
        bio: `Bladder enthusiast | ${preset} vibes | Here for the community`,
        avatar: presetNames.find(p => p.name === preset)?.emoji || '👤',
      });
    };

    const handleAutoFillConfirm = () => {
      setSignupStep(2);
    };

    const handleFinalSignup = () => {
      if (selectedPreset) {
        startSignup(selectedPreset);
      }
    };

    return (
      <div className="bg-gray-900 border-t border-gray-700 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="p-6">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">👤 Create Your Account</h3>
            <p className="text-gray-400 text-sm mb-6 text-center">Join BladderChat and start interacting!</p>
            
            {state.playerAccount.signupProgress > 0 && state.playerAccount.signupProgress < 100 ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400 mb-2">Setting up your account...</div>
                  <div className="text-sm text-gray-400">{state.playerAccount.signupProgress.toFixed(0)}% complete</div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                    style={{ width: `${state.playerAccount.signupProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-center space-y-1">
                  {state.playerAccount.signupProgress < 25 && <div>✓ Creating profile...</div>}
                  {state.playerAccount.signupProgress >= 25 && state.playerAccount.signupProgress < 50 && <div>✓ Setting up feed...</div>}
                  {state.playerAccount.signupProgress >= 50 && state.playerAccount.signupProgress < 75 && <div>✓ Connecting to community...</div>}
                  {state.playerAccount.signupProgress >= 75 && <div>✓ Finalizing setup...</div>}
                </div>
              </div>
            ) : signupStep === 0 ? (
              // Step 1: Choose preset name
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-300 mb-4">Choose your username:</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {presetNames.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset.name)}
                      className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedPreset === preset.name
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{preset.emoji}</div>
                      <div className={`text-lg font-bold bg-gradient-to-r ${preset.color} bg-clip-text text-transparent`}>
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Select a preset name to continue
                </div>
              </div>
            ) : signupStep === 1 ? (
              // Step 2: Auto-fill profile
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-300 mb-4">Profile auto-generated:</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Username</label>
                    <div className="text-white font-bold text-lg">{selectedPreset}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Email</label>
                    <div className="text-gray-300">{autoFillData.email}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Avatar</label>
                    <div className="text-3xl">{autoFillData.avatar}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Bio</label>
                    <div className="text-gray-300 text-sm">{autoFillData.bio}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSignupStep(0)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleAutoFillConfirm}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              // Step 3: Final confirmation
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-300 mb-4">Confirm your account:</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{autoFillData.avatar}</div>
                    <div>
                      <div className="text-white font-bold text-xl">{selectedPreset}</div>
                      <div className="text-gray-400 text-sm">{autoFillData.email}</div>
                    </div>
                  </div>
                  <div className="text-gray-300 text-sm border-t border-gray-700 pt-3">
                    {autoFillData.bio}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSignupStep(1)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSignup}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-colors"
                  >
                    Create Account
                  </button>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Account setup will take 20 seconds
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border-t border-gray-700 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
            >
              ← Back
            </button>
            <h3 className="text-lg font-bold text-white">👤 My Account</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              💰 <span className="text-green-400">${state.money.toFixed(2)}</span>
            </span>
            <span className="text-gray-400">
              👥 <span className="text-blue-400">{state.followerCount}</span> followers
            </span>
          </div>
        </div>

      {/* Create Post */}
      <div className="mb-6">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          rows={3}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">{newPostContent.length} / 280</span>
          <button
            onClick={handlePost}
            disabled={!newPostContent.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold disabled:bg-gray-700 disabled:text-gray-500 hover:bg-blue-500 transition-colors"
          >
            Post
          </button>
        </div>
      </div>

      {/* Make Suggestions */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-400 mb-3">💡 Suggest Challenges</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSuggestion}
            onChange={(e) => setNewSuggestion(e.target.value)}
            placeholder="Suggest a challenge for Sarah..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
            maxLength={100}
          />
          <button
            onClick={handleMakeSuggestion}
            disabled={!newSuggestion.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold disabled:bg-gray-700 disabled:text-gray-500 hover:bg-purple-500 transition-colors text-sm"
          >
            Send
          </button>
        </div>
        
        {/* My Suggestions */}
        {state.playerAccount.playerSuggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-500">Your Recent Suggestions:</div>
            {state.playerAccount.playerSuggestions.slice(0, 5).map((suggestion) => (
              <div key={suggestion.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-300">"{suggestion.content}"</div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      {formatTime(suggestion.timestamp)}
                      {suggestion.accepted && (
                        <span className="ml-2 text-green-400">✓ Accepted</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Posts */}
      <div>
        <h4 className="text-sm font-bold text-gray-400 mb-3">My Posts</h4>
        {state.playerAccount.posts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No posts yet. Share something!</p>
        ) : (
          <div className="space-y-3">
            {state.playerAccount.posts.map((post) => (
              <div key={post.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {state.playerAccount.username[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">@{state.playerAccount.username}</span>
                      <span className="text-xs text-gray-500">{formatTime(post.timestamp)}</span>
                    </div>
                    <p className="text-gray-200 text-sm mb-2">{post.content}</p>
                    
                    {/* Comments */}
                    {post.commentList && post.commentList.length > 0 && (
                      <div className="mt-2 space-y-2 border-t border-gray-700 pt-2">
                        {post.commentList.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              comment.isFromPlayer ? 'bg-blue-600' : 'bg-gray-600'
                            }`}>
                              {comment.author[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${comment.isFromPlayer ? 'text-blue-400' : 'text-gray-400'}`}>
                                  @{comment.author}
                                </span>
                                <span className="text-xs text-gray-600">{formatTime(comment.timestamp)}</span>
                              </div>
                              <p className="text-xs text-gray-300">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded disabled:bg-gray-700 disabled:text-gray-500 hover:bg-blue-500 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
