// Main feed page component for Sonad
import React, { useState, useEffect } from 'react';
import { TwitterPost, SonadPost } from '../types/twitter';
import PostCard from './PostCard';
import { useSonadContract } from '../hooks/useSonadContract';

interface FeedPageProps {
  className?: string;
}

const FeedPage: React.FC<FeedPageProps> = ({ className = '' }) => {
  const [posts, setPosts] = useState<SonadPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getTotalPosts, getPost } = useSonadContract();

  // Sample Twitter data - replace with your API call
  const sampleTwitterData: TwitterPost[] = [
    {
      id: "1967419837006901294",
      author_id: "1704079725839495168",
      text: "Gm🌟 Gmonad💜\n\nSay it back🪻 https://t.co/vPrOL7ulIw",
      created_at: "2025-09-20T02:00:57.349Z",
      retweet_count: 24,
      reply_count: 679,
      like_count: 1173,
      quote_count: 4,
      bookmark_count: 22,
      impression_count: 22430,
      fetched_at: "2025-09-20T02:00:57.349Z",
      updated_at: "2025-09-20T02:00:57.349Z",
      username: "1Cilineth",
      name: "Cilin (mainnet arc)",
      profile_image_url: "https://pbs.twimg.com/profile_images/1933135848851283968/bzBh7Biv_normal.jpg",
      media: [
        {
          media_key: "3_1967419825015406592",
          type: "photo",
          url: "https://pbs.twimg.com/media/G02t6DIawAAdZZm.jpg",
          preview_image_url: null,
          width: 2684,
          height: 3205
        }
      ]
    }
  ];

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);

      // 1. Fetch Twitter posts (replace with your API)
      const twitterPosts = sampleTwitterData; // Replace with: await fetchTwitterPosts();

      // 2. Enhance with blockchain data
      const enhancedPosts = await Promise.all(
        twitterPosts.map(async (twitterPost) => {
          try {
            // Check if post exists on-chain
            const onChainPost = await getPost(BigInt(twitterPost.id));

            if (onChainPost) {
              return {
                ...twitterPost,
                onChainId: BigInt(twitterPost.id),
                verified: onChainPost.verified,
                litCount: Number(onChainPost.litCount),
                shitCount: Number(onChainPost.shitCount),
                totalTips: (Number(onChainPost.totalTips) / 1e18).toFixed(4),
                hasUserVoted: false, // Will be checked per user
              } as SonadPost;
            }

            return {
              ...twitterPost,
              verified: false,
              litCount: 0,
              shitCount: 0,
              totalTips: "0",
              hasUserVoted: false,
            } as SonadPost;
          } catch (error) {
            // Post not on chain yet
            return {
              ...twitterPost,
              verified: false,
              litCount: 0,
              shitCount: 0,
              totalTips: "0",
              hasUserVoted: false,
            } as SonadPost;
          }
        })
      );

      setPosts(enhancedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: string, isLit: boolean) => {
    try {
      // Update local state optimistically
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? {
              ...post,
              litCount: isLit ? (post.litCount || 0) + 1 : (post.litCount || 0),
              shitCount: !isLit ? (post.shitCount || 0) + 1 : (post.shitCount || 0),
              hasUserVoted: true,
              userVote: isLit ? 'lit' : 'shit'
            }
          : post
      ));

      // TODO: Call blockchain vote function
      console.log(`Voting ${isLit ? 'Lit' : 'Shit'} on post ${postId}`);
    } catch (error) {
      console.error('Vote failed:', error);
      // Revert optimistic update
      loadFeed();
    }
  };

  const handleTip = async (postId: string, amount: string) => {
    try {
      // Update local state optimistically
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? {
              ...post,
              totalTips: (parseFloat(post.totalTips || '0') + parseFloat(amount)).toFixed(4)
            }
          : post
      ));

      // TODO: Call blockchain tip function
      console.log(`Tipping ${amount} ETH to post ${postId}`);
    } catch (error) {
      console.error('Tip failed:', error);
      // Revert optimistic update
      loadFeed();
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${className}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${className}`}>
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">Failed to load feed</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={loadFeed}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto p-4 ${className}`}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Sonad Feed
        </h1>
        <p className="text-gray-600 mt-2">
          Twitter posts with $MONAD and $NAD hashtags
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-purple-500">{posts.length}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-green-500">
            {posts.filter(p => p.verified).length}
          </div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-blue-500">
            {posts.reduce((sum, p) => sum + parseFloat(p.totalTips || '0'), 0).toFixed(2)} ETH
          </div>
          <div className="text-sm text-gray-600">Total Tips</div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onVote={handleVote}
            onTip={handleTip}
          />
        ))}
      </div>

      {/* Load More */}
      {posts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadFeed}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedPage;