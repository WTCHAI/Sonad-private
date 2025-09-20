// Individual post card component with voting and tipping
import React, { useState } from 'react';
import { SonadPost } from '../types/twitter';
import TipModal from './TipModal';
import VoteButtons from './VoteButtons';

interface PostCardProps {
  post: SonadPost;
  onVote: (postId: string, isLit: boolean) => Promise<void>;
  onTip: (postId: string, amount: string) => Promise<void>;
}

const PostCard: React.FC<PostCardProps> = ({ post, onVote, onTip }) => {
  const [showTipModal, setShowTipModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleVote = async (isLit: boolean) => {
    if (post.hasUserVoted || isVoting) return;

    setIsVoting(true);
    try {
      await onVote(post.id, isLit);
    } finally {
      setIsVoting(false);
    }
  };

  const handleTipSubmit = async (amount: string) => {
    await onTip(post.id, amount);
    setShowTipModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.profile_image_url}
              alt={post.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.name}</h3>
                {post.verified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">@{post.username}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(post.created_at)}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.text}
          </p>
        </div>

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className="mb-4">
            {post.media.map((media) => (
              <div key={media.media_key} className="rounded-lg overflow-hidden">
                {media.type === 'photo' && (
                  <img
                    src={media.url}
                    alt="Post media"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Twitter Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4 pb-4 border-b">
          <span>💬 {formatNumber(post.reply_count)}</span>
          <span>🔄 {formatNumber(post.retweet_count)}</span>
          <span>❤️ {formatNumber(post.like_count)}</span>
          <span>👁️ {formatNumber(post.impression_count)}</span>
        </div>

        {/* Sonad Actions */}
        <div className="space-y-4">
          {/* Blockchain Stats */}
          {post.verified && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1">
                  <span className="text-green-500">🔥</span>
                  <span>{post.litCount || 0} Lit</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="text-red-500">💩</span>
                  <span>{post.shitCount || 0} Shit</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="text-blue-500">💰</span>
                  <span>{post.totalTips || '0'} ETH</span>
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            {/* Vote Buttons */}
            <VoteButtons
              hasVoted={post.hasUserVoted}
              userVote={post.userVote}
              isLoading={isVoting}
              onVote={handleVote}
              verified={post.verified}
            />

            {/* Tip Button */}
            <button
              onClick={() => setShowTipModal(true)}
              disabled={!post.verified}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                post.verified
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              💰 Tip Creator
            </button>
          </div>

          {/* Not Verified Message */}
          {!post.verified && (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500">
                This post needs to be verified by Sonad to enable voting and tipping
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <TipModal
          post={post}
          onClose={() => setShowTipModal(false)}
          onTip={handleTipSubmit}
        />
      )}
    </>
  );
};

export default PostCard;