import { useState } from 'react';
import { SimulationState, SocialMediaPost, SocialMediaComment } from '../types';

interface PlayerAccountPanelProps {
  state: SimulationState;
  onPost: (content: string) => void;
  onComment: (postId: string, content: string) => void;
  onExit: () => void;
}

export default function PlayerAccountPanel({ state, onPost, onComment, onExit }: PlayerAccountPanelProps) {
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

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

  const formatTime = (simTime: number) => {
    const hours = Math.floor(simTime / 3600) % 24;
    const minutes = Math.floor((simTime % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4">
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
  );
}
