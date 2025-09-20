// Voting buttons component (Lit/Shit)
import React from 'react';

interface VoteButtonsProps {
  hasVoted?: boolean;
  userVote?: 'lit' | 'shit' | null;
  isLoading: boolean;
  onVote: (isLit: boolean) => void;
  verified?: boolean;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  hasVoted = false,
  userVote = null,
  isLoading,
  onVote,
  verified = false
}) => {
  const handleLitClick = () => {
    if (!hasVoted && !isLoading && verified) {
      onVote(true);
    }
  };

  const handleShitClick = () => {
    if (!hasVoted && !isLoading && verified) {
      onVote(false);
    }
  };

  if (!verified) {
    return (
      <div className="flex space-x-2">
        <button
          disabled
          className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          🔥 Lit
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          💩 Shit
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      {/* Lit Button */}
      <button
        onClick={handleLitClick}
        disabled={hasVoted || isLoading}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : hasVoted
            ? userVote === 'lit'
              ? 'bg-green-200 text-green-800 cursor-default'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
        }`}
      >
        {isLoading && userVote !== 'shit' ? (
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 border border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span>🔥 Lit</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1">
            <span>🔥</span>
            <span>Lit</span>
            {hasVoted && userVote === 'lit' && <span>✓</span>}
          </span>
        )}
      </button>

      {/* Shit Button */}
      <button
        onClick={handleShitClick}
        disabled={hasVoted || isLoading}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : hasVoted
            ? userVote === 'shit'
              ? 'bg-red-200 text-red-800 cursor-default'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer'
        }`}
      >
        {isLoading && userVote !== 'lit' ? (
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span>💩 Shit</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1">
            <span>💩</span>
            <span>Shit</span>
            {hasVoted && userVote === 'shit' && <span>✓</span>}
          </span>
        )}
      </button>
    </div>
  );
};

export default VoteButtons;