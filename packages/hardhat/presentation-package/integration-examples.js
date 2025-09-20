// Sonad Contract Integration Examples
// Replace with your actual frontend framework (React, Vue, etc.)

import { ethers } from 'ethers';
import SonadABI from './Sonad-abi.json';
import MockMonadTokenABI from './MockMonadToken-abi.json';

// Contract Addresses
const SONAD_ADDRESS = '0x96079982fD20Ed66CDEe1A8009058a50727cEBB3';
const MONAD_TOKEN_ADDRESS = '0x95fCB10fcD03208d3aa468db53433cb23167002D';
const RPC_URL = 'https://testnet-rpc.monad.xyz/';

// Initialize Provider and Contracts
export const setupContracts = async () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = await provider.getSigner();

  const sonadContract = new ethers.Contract(SONAD_ADDRESS, SonadABI, signer);
  const monadToken = new ethers.Contract(MONAD_TOKEN_ADDRESS, MockMonadTokenABI, signer);

  return { sonadContract, monadToken, provider, signer };
};

// 1. Get Test Tokens (for testing only)
export const getTestTokens = async (monadToken) => {
  try {
    const tx = await monadToken.faucet();
    await tx.wait();
    console.log('✅ Received 100 test MONAD tokens');
    return tx.hash;
  } catch (error) {
    console.error('❌ Error getting test tokens:', error);
    throw error;
  }
};

// 2. Check User's MONAD Balance
export const checkMonadBalance = async (monadToken, userAddress) => {
  try {
    const balance = await monadToken.balanceOf(userAddress);
    const formattedBalance = ethers.formatEther(balance);
    console.log(`💰 MONAD Balance: ${formattedBalance}`);
    return formattedBalance;
  } catch (error) {
    console.error('❌ Error checking balance:', error);
    throw error;
  }
};

// 3. Vote on a Post
export const voteOnPost = async (sonadContract, postId, isLit) => {
  try {
    const tx = await sonadContract.vote(postId, isLit);
    await tx.wait();
    console.log(`✅ Voted ${isLit ? 'Lit' : 'Shit'} on post ${postId}`);
    return tx.hash;
  } catch (error) {
    console.error('❌ Error voting:', error);
    throw error;
  }
};

// 4. Tip a Creator
export const tipCreator = async (sonadContract, postId, tipAmountETH) => {
  try {
    const tipAmount = ethers.parseEther(tipAmountETH.toString());
    const tx = await sonadContract.tipCreator(postId, { value: tipAmount });
    await tx.wait();
    console.log(`✅ Tipped ${tipAmountETH} ETH to post ${postId} creator`);
    return tx.hash;
  } catch (error) {
    console.error('❌ Error tipping:', error);
    throw error;
  }
};

// 5. Get Post Details
export const getPostDetails = async (sonadContract, postId) => {
  try {
    const post = await sonadContract.getPost(postId);
    return {
      tweetId: post.tweetId,
      creator: post.creator,
      content: post.content,
      timestamp: Number(post.timestamp),
      litCount: Number(post.litCount),
      shitCount: Number(post.shitCount),
      totalTips: ethers.formatEther(post.totalTips),
      verified: post.verified,
      active: post.active
    };
  } catch (error) {
    console.error('❌ Error getting post:', error);
    throw error;
  }
};

// 6. Get User's Voting Rewards
export const getUserRewards = async (sonadContract, userAddress) => {
  try {
    const rewards = await sonadContract.getVoterRewards(userAddress);
    return {
      points: Number(rewards.points),
      nftCount: Number(rewards.nftCount)
    };
  } catch (error) {
    console.error('❌ Error getting rewards:', error);
    throw error;
  }
};

// 7. Check if User Voted on Post
export const hasUserVoted = async (sonadContract, userAddress, postId) => {
  try {
    const voted = await sonadContract.hasUserVoted(userAddress, postId);
    return voted;
  } catch (error) {
    console.error('❌ Error checking vote status:', error);
    throw error;
  }
};

// 8. Get Total Posts Count
export const getTotalPosts = async (sonadContract) => {
  try {
    const total = await sonadContract.getTotalPosts();
    return Number(total);
  } catch (error) {
    console.error('❌ Error getting total posts:', error);
    throw error;
  }
};

// 9. Listen to Contract Events
export const setupEventListeners = (sonadContract) => {
  // Listen for new posts
  sonadContract.on('PostVerified', (postId, tweetId, creator) => {
    console.log('📝 New post verified:', { postId: Number(postId), tweetId, creator });
  });

  // Listen for votes
  sonadContract.on('VoteCast', (postId, voter, isLit, points, nftAwarded) => {
    console.log('🗳️ Vote cast:', {
      postId: Number(postId),
      voter,
      vote: isLit ? 'Lit' : 'Shit',
      points: Number(points),
      nftAwarded
    });
  });

  // Listen for tips
  sonadContract.on('TipSent', (postId, tipper, amount) => {
    console.log('💰 Tip sent:', {
      postId: Number(postId),
      tipper,
      amount: ethers.formatEther(amount)
    });
  });

  // Listen for NFT mints
  sonadContract.on('NFTMinted', (recipient, tokenId) => {
    console.log('🎨 NFT minted:', { recipient, tokenId: Number(tokenId) });
  });
};

// Example Usage in React Component
export const ExampleUsage = () => {
  const [contracts, setContracts] = useState(null);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const { sonadContract, monadToken } = await setupContracts();
        setContracts({ sonadContract, monadToken });

        // Setup event listeners
        setupEventListeners(sonadContract);

        // Get user address
        const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
        setUserAddress(await signer.getAddress());
      } catch (error) {
        console.error('Failed to initialize contracts:', error);
      }
    };

    init();
  }, []);

  const handleVote = async (postId, isLit) => {
    if (!contracts) return;

    try {
      // Check if user has enough tokens
      const balance = await checkMonadBalance(contracts.monadToken, userAddress);
      if (parseFloat(balance) < 1) {
        // Get test tokens first
        await getTestTokens(contracts.monadToken);
      }

      // Vote
      await voteOnPost(contracts.sonadContract, postId, isLit);
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleVote(1, true)}>Vote Lit on Post 1</button>
      <button onClick={() => handleVote(1, false)}>Vote Shit on Post 1</button>
    </div>
  );
};