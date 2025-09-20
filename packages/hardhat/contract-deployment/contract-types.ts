// TypeScript interfaces for Sonad contract interactions
// Generated for better type safety and developer experience

import { Address } from 'viem';

// Network Configuration
export const MONAD_TESTNET_CONFIG = {
  chainId: 10143,
  name: 'Monad Testnet',
  rpcUrl: 'https://testnet-rpc.monad.xyz/',
  explorer: 'https://testnet.monadexplorer.com',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
} as const;

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  SONAD: '0x96079982fD20Ed66CDEe1A8009058a50727cEBB3' as Address,
  MOCK_MONAD_TOKEN: '0x95fCB10fcD03208d3aa468db53433cb23167002D' as Address,
} as const;

// Sonad Contract Types
export interface TwitterPost {
  tweetId: string;
  creator: Address;
  content: string;
  timestamp: bigint;
  litCount: bigint;
  shitCount: bigint;
  totalTips: bigint;
  verified: boolean;
  active: boolean;
}

export interface VoterRewards {
  points: bigint;
  nftCount: bigint;
}

export interface VoterReward {
  points: bigint;
  nftCount: bigint;
  hasVoted: boolean;
}

// Event Types
export interface PostVerifiedEvent {
  postId: bigint;
  tweetId: string;
  creator: Address;
}

export interface VoteCastEvent {
  postId: bigint;
  voter: Address;
  isLit: boolean;
  points: bigint;
  nftAwarded: boolean;
}

export interface TipSentEvent {
  postId: bigint;
  tipper: Address;
  amount: bigint;
}

export interface NFTMintedEvent {
  recipient: Address;
  tokenId: bigint;
}

export interface MinimumHoldingUpdatedEvent {
  newMinimum: bigint;
}

// Function Parameter Types
export interface VerifyAndRegisterPostParams {
  tweetId: string;
  creator: Address;
  content: string;
}

export interface VoteParams {
  postId: bigint;
  isLit: boolean;
}

export interface TipCreatorParams {
  postId: bigint;
  value: bigint;
}

// Contract Constants
export const SONAD_CONSTANTS = {
  POINTS_PER_VOTE: 10n,
  NFT_DROP_CHANCE: 100n, // 1% chance (1/100)
  TIP_CREATOR_PERCENTAGE: 90n, // 90% to creator
  MINIMUM_MONAD_HOLDING: 1000000000000000000n, // 1 MONAD token (18 decimals)
} as const;

// Token Constants
export const TOKEN_CONSTANTS = {
  FAUCET_AMOUNT: 100000000000000000000n, // 100 tokens
  DECIMALS: 18n,
  NAME: 'Mock Monad Token',
  SYMBOL: 'MONAD',
} as const;

// Utility Types
export type TransactionHash = `0x${string}`;
export type BlockNumber = bigint;

// Error Types
export interface ContractError {
  name: string;
  message: string;
  cause?: unknown;
}

// Hook Return Types (for React/Vue integrations)
export interface UseContractReadResult<T> {
  data: T | undefined;
  error: ContractError | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export interface UseContractWriteResult {
  write: (args?: any) => Promise<TransactionHash>;
  error: ContractError | null;
  isLoading: boolean;
  isSuccess: boolean;
  txHash: TransactionHash | undefined;
}

// Utility functions for type conversion
export const formatTokenAmount = (amount: bigint, decimals: number = 18): string => {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(4);
};

export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  return BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));
};

export const formatTimestamp = (timestamp: bigint): Date => {
  return new Date(Number(timestamp) * 1000);
};

// Event filter types for listening to contract events
export interface EventFilters {
  PostVerified?: {
    postId?: bigint;
    creator?: Address;
  };
  VoteCast?: {
    postId?: bigint;
    voter?: Address;
  };
  TipSent?: {
    postId?: bigint;
    tipper?: Address;
  };
  NFTMinted?: {
    recipient?: Address;
  };
}

// Contract interaction status
export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

export interface TransactionState {
  status: TransactionStatus;
  hash?: TransactionHash;
  error?: string;
}

// Frontend integration helpers
export interface SonadContractHelpers {
  // Read operations
  getPost: (postId: bigint) => Promise<TwitterPost>;
  getVoterRewards: (voter: Address) => Promise<VoterRewards>;
  getTotalPosts: () => Promise<bigint>;
  hasUserVoted: (user: Address, postId: bigint) => Promise<boolean>;
  getCreatorPosts: (creator: Address) => Promise<bigint[]>;

  // Write operations
  vote: (postId: bigint, isLit: boolean) => Promise<TransactionHash>;
  tipCreator: (postId: bigint, amount: bigint) => Promise<TransactionHash>;
  verifyAndRegisterPost: (params: VerifyAndRegisterPostParams) => Promise<TransactionHash>;

  // Token operations
  getMonadBalance: (user: Address) => Promise<bigint>;
  requestFaucetTokens: () => Promise<TransactionHash>;
}

export default {
  CONTRACT_ADDRESSES,
  MONAD_TESTNET_CONFIG,
  SONAD_CONSTANTS,
  TOKEN_CONSTANTS,
  formatTokenAmount,
  parseTokenAmount,
  formatTimestamp,
};