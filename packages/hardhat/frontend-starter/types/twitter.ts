// TypeScript types for Twitter API response
export interface TwitterPost {
  id: string;
  author_id: string;
  text: string;
  created_at: string;
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
  fetched_at: string;
  updated_at: string;
  username: string;
  name: string;
  profile_image_url: string;
  media?: TwitterMedia[];
}

export interface TwitterMedia {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url: string;
  preview_image_url?: string;
  width: number;
  height: number;
}

// Extended type for blockchain integration
export interface SonadPost extends TwitterPost {
  // Blockchain data
  onChainId?: bigint;
  verified?: boolean;
  litCount?: number;
  shitCount?: number;
  totalTips?: string; // ETH amount
  hasUserVoted?: boolean;
  userVote?: 'lit' | 'shit' | null;
}

export interface VoteData {
  postId: bigint;
  isLit: boolean;
  points: number;
  nftAwarded: boolean;
}

export interface TipData {
  postId: bigint;
  amount: string; // ETH amount
  recipient: string;
}