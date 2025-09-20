// Sonad Contract Integration Examples with parseAbi format
// Modern TypeScript examples using viem/wagmi and parseAbi

import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SonadAbi, SONAD_CONTRACT_ADDRESS } from './Sonad-parseAbi';
import { MockMonadTokenAbi, MOCK_MONAD_TOKEN_ADDRESS } from './MockMonadToken-parseAbi';
import {
  CONTRACT_ADDRESSES,
  MONAD_TESTNET_CONFIG,
  TwitterPost,
  VoterRewards,
  TransactionHash,
  formatTokenAmount,
  parseTokenAmount
} from './contract-types';

// Custom chain configuration for Monad testnet
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
} as const;

// Initialize clients
export const setupClients = (privateKey?: `0x${string}`) => {
  const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });

  const walletClient = privateKey ? createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain: monadTestnet,
    transport: http(),
  }) : null;

  return { publicClient, walletClient };
};

// 1. Get Test Tokens (Faucet)
export const getTestTokens = async (walletClient: any): Promise<TransactionHash> => {
  const { request } = await walletClient.simulateContract({
    address: CONTRACT_ADDRESSES.MOCK_MONAD_TOKEN,
    abi: MockMonadTokenAbi,
    functionName: 'faucet',
  });

  const hash = await walletClient.writeContract(request);
  console.log('✅ Faucet transaction:', hash);
  return hash;
};

// 2. Check MONAD Token Balance
export const checkMonadBalance = async (
  publicClient: any,
  userAddress: `0x${string}`
): Promise<string> => {
  const balance = await publicClient.readContract({
    address: CONTRACT_ADDRESSES.MOCK_MONAD_TOKEN,
    abi: MockMonadTokenAbi,
    functionName: 'balanceOf',
    args: [userAddress],
  });

  const formattedBalance = formatEther(balance);
  console.log(`💰 MONAD Balance: ${formattedBalance}`);
  return formattedBalance;
};

// 3. Vote on a Post
export const voteOnPost = async (
  walletClient: any,
  postId: bigint,
  isLit: boolean
): Promise<TransactionHash> => {
  const { request } = await walletClient.simulateContract({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    functionName: 'vote',
    args: [postId, isLit],
  });

  const hash = await walletClient.writeContract(request);
  console.log(`✅ Voted ${isLit ? 'Lit' : 'Shit'} on post ${postId}:`, hash);
  return hash;
};

// 4. Tip a Creator
export const tipCreator = async (
  walletClient: any,
  postId: bigint,
  tipAmountETH: string
): Promise<TransactionHash> => {
  const tipAmount = parseEther(tipAmountETH);

  const { request } = await walletClient.simulateContract({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    functionName: 'tipCreator',
    args: [postId],
    value: tipAmount,
  });

  const hash = await walletClient.writeContract(request);
  console.log(`✅ Tipped ${tipAmountETH} ETH to post ${postId}:`, hash);
  return hash;
};

// 5. Get Post Details
export const getPostDetails = async (
  publicClient: any,
  postId: bigint
): Promise<TwitterPost> => {
  const post = await publicClient.readContract({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    functionName: 'getPost',
    args: [postId],
  });

  const formattedPost: TwitterPost = {
    tweetId: post.tweetId,
    creator: post.creator,
    content: post.content,
    timestamp: post.timestamp,
    litCount: post.litCount,
    shitCount: post.shitCount,
    totalTips: post.totalTips,
    verified: post.verified,
    active: post.active,
  };

  console.log('📄 Post details:', formattedPost);
  return formattedPost;
};

// 6. Get User's Voting Rewards
export const getUserRewards = async (
  publicClient: any,
  userAddress: `0x${string}`
): Promise<VoterRewards> => {
  const [points, nftCount] = await publicClient.readContract({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    functionName: 'getVoterRewards',
    args: [userAddress],
  });

  const rewards: VoterRewards = { points, nftCount };
  console.log('🏆 User rewards:', rewards);
  return rewards;
};

// 7. Check if User Voted on Post
export const hasUserVoted = async (
  publicClient: any,
  userAddress: `0x${string}`,
  postId: bigint
): Promise<boolean> => {
  const voted = await publicClient.readContract({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    functionName: 'hasUserVoted',
    args: [userAddress, postId],
  });

  console.log(`🗳️ User ${userAddress} voted on post ${postId}:`, voted);
  return voted;
};

// 8. Get Total Posts Count
export const getTotalPosts = async (publicClient: any): Promise<bigint> => {
  const total = await publicClient.readContract({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    functionName: 'getTotalPosts',
  });

  console.log('📊 Total posts:', total);
  return total;
};

// 9. Verify and Register Post (Admin only)
export const verifyAndRegisterPost = async (
  walletClient: any,
  tweetId: string,
  creator: `0x${string}`,
  content: string
): Promise<TransactionHash> => {
  const { request } = await walletClient.simulateContract({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    functionName: 'verifyAndRegisterPost',
    args: [tweetId, creator, content],
  });

  const hash = await walletClient.writeContract(request);
  console.log('✅ Post verified and registered:', hash);
  return hash;
};

// 10. Listen to Contract Events
export const setupEventListeners = (publicClient: any) => {
  // Listen for new posts
  const unsubscribePostVerified = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    eventName: 'PostVerified',
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        console.log('📝 New post verified:', {
          postId: log.args.postId,
          tweetId: log.args.tweetId,
          creator: log.args.creator,
        });
      });
    },
  });

  // Listen for votes
  const unsubscribeVoteCast = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    eventName: 'VoteCast',
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        console.log('🗳️ Vote cast:', {
          postId: log.args.postId,
          voter: log.args.voter,
          vote: log.args.isLit ? 'Lit' : 'Shit',
          points: log.args.points,
          nftAwarded: log.args.nftAwarded,
        });
      });
    },
  });

  // Listen for tips
  const unsubscribeTipSent = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    eventName: 'TipSent',
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        console.log('💰 Tip sent:', {
          postId: log.args.postId,
          tipper: log.args.tipper,
          amount: formatEther(log.args.amount),
        });
      });
    },
  });

  // Listen for NFT mints
  const unsubscribeNFTMinted = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESSES.SONAD,
    abi: SonadAbi,
    eventName: 'NFTMinted',
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        console.log('🎨 NFT minted:', {
          recipient: log.args.recipient,
          tokenId: log.args.tokenId,
        });
      });
    },
  });

  return {
    unsubscribePostVerified,
    unsubscribeVoteCast,
    unsubscribeTipSent,
    unsubscribeNFTMinted,
  };
};

// 11. Complete Integration Example
export const SonadIntegration = {
  // Initialize the integration
  async init(privateKey?: `0x${string}`) {
    const { publicClient, walletClient } = setupClients(privateKey);
    return { publicClient, walletClient };
  },

  // High-level operations
  async handleVote(
    walletClient: any,
    publicClient: any,
    userAddress: `0x${string}`,
    postId: bigint,
    isLit: boolean
  ) {
    try {
      // Check if user has enough tokens
      const balance = await checkMonadBalance(publicClient, userAddress);
      if (parseFloat(balance) < 1) {
        console.log('Getting test tokens...');
        await getTestTokens(walletClient);
      }

      // Check if already voted
      const alreadyVoted = await hasUserVoted(publicClient, userAddress, postId);
      if (alreadyVoted) {
        throw new Error('Already voted on this post');
      }

      // Cast vote
      return await voteOnPost(walletClient, postId, isLit);
    } catch (error) {
      console.error('Vote failed:', error);
      throw error;
    }
  },

  async handleTip(
    walletClient: any,
    postId: bigint,
    tipAmount: string
  ) {
    try {
      return await tipCreator(walletClient, postId, tipAmount);
    } catch (error) {
      console.error('Tip failed:', error);
      throw error;
    }
  },

  // Event monitoring
  startEventListening(publicClient: any) {
    return setupEventListeners(publicClient);
  },
};

// Example usage in a React/Vue component
export const ExampleUsage = `
// Example React hook using the parseAbi format
import { useContractRead, useContractWrite } from 'wagmi';
import { SonadAbi, SONAD_CONTRACT_ADDRESS } from './Sonad-parseAbi';

export function useVoteOnPost() {
  const { write, isLoading, isSuccess } = useContractWrite({
    address: SONAD_CONTRACT_ADDRESS,
    abi: SonadAbi,
    functionName: 'vote',
  });

  const vote = (postId: bigint, isLit: boolean) => {
    write({ args: [postId, isLit] });
  };

  return { vote, isLoading, isSuccess };
}

export function usePostDetails(postId: bigint) {
  const { data, isLoading } = useContractRead({
    address: SONAD_CONTRACT_ADDRESS,
    abi: SonadAbi,
    functionName: 'getPost',
    args: [postId],
  });

  return { post: data, isLoading };
}
`;

export default SonadIntegration;