# 🚀 Sonad Contract Integration - parseAbi Format

Modern TypeScript integration using human-readable ABIs and type safety.

## 📁 **Files Overview**

### **parseAbi Format (Recommended)**
- `Sonad-parseAbi.ts` - Main contract ABI in parseAbi format
- `MockMonadToken-parseAbi.ts` - Token contract ABI in parseAbi format
- `contract-types.ts` - TypeScript interfaces and utilities
- `integration-examples-parseAbi.ts` - Modern integration examples

### **Legacy Format (Compatibility)**
- `Sonad-abi.json` - Raw ABI (for wagmi/ethers v5)
- `MockMonadToken-abi.json` - Raw token ABI

## ⚡ **Quick Start**

### **1. Install Dependencies**
```bash
npm install viem wagmi @tanstack/react-query
# or
yarn add viem wagmi @tanstack/react-query
```

### **2. Import parseAbi**
```typescript
import { SonadAbi, SONAD_CONTRACT_ADDRESS } from './Sonad-parseAbi';
import { MockMonadTokenAbi, MOCK_MONAD_TOKEN_ADDRESS } from './MockMonadToken-parseAbi';
```

### **3. Use with viem**
```typescript
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  chain: {
    id: 10143,
    name: 'Monad Testnet',
    rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz/'] } },
  },
  transport: http(),
});

// Read contract
const totalPosts = await client.readContract({
  address: SONAD_CONTRACT_ADDRESS,
  abi: SonadAbi,
  functionName: 'getTotalPosts',
});
```

### **4. Use with wagmi**
```typescript
import { useContractRead, useContractWrite } from 'wagmi';

// Read hook
const { data: totalPosts } = useContractRead({
  address: SONAD_CONTRACT_ADDRESS,
  abi: SonadAbi,
  functionName: 'getTotalPosts',
});

// Write hook
const { write: vote } = useContractWrite({
  address: SONAD_CONTRACT_ADDRESS,
  abi: SonadAbi,
  functionName: 'vote',
});
```

## 🎯 **Key Functions**

### **Read Functions**
```typescript
// Get post details
"function getPost(uint256 _postId) view returns (tuple(string tweetId, address creator, string content, uint256 timestamp, uint256 litCount, uint256 shitCount, uint256 totalTips, bool verified, bool active))"

// Get user rewards
"function getVoterRewards(address _voter) view returns (uint256 points, uint256 nftCount)"

// Check if voted
"function hasUserVoted(address _user, uint256 _postId) view returns (bool)"

// Get total posts
"function getTotalPosts() view returns (uint256)"
```

### **Write Functions**
```typescript
// Vote on post
"function vote(uint256 _postId, bool _isLit)"

// Tip creator
"function tipCreator(uint256 _postId) payable"

// Get test tokens
"function faucet()" // MockMonadToken only
```

## 📡 **Events**

### **Important Events to Listen**
```typescript
// New post verified
"event PostVerified(uint256 indexed postId, string tweetId, address indexed creator)"

// Vote cast
"event VoteCast(uint256 indexed postId, address indexed voter, bool isLit, uint256 points, bool nftAwarded)"

// Tip sent
"event TipSent(uint256 indexed postId, address indexed tipper, uint256 amount)"

// NFT minted
"event NFTMinted(address indexed recipient, uint256 tokenId)"
```

### **Event Listening Example**
```typescript
const unsubscribe = client.watchContractEvent({
  address: SONAD_CONTRACT_ADDRESS,
  abi: SonadAbi,
  eventName: 'VoteCast',
  onLogs: (logs) => {
    logs.forEach((log) => {
      console.log('Vote cast:', log.args);
    });
  },
});
```

## 🛠️ **Integration Examples**

### **React Component Example**
```typescript
import { useContractRead, useContractWrite } from 'wagmi';
import { SonadAbi, SONAD_CONTRACT_ADDRESS } from './Sonad-parseAbi';

export function VoteComponent({ postId }: { postId: bigint }) {
  const { data: post } = useContractRead({
    address: SONAD_CONTRACT_ADDRESS,
    abi: SonadAbi,
    functionName: 'getPost',
    args: [postId],
  });

  const { write: vote, isLoading } = useContractWrite({
    address: SONAD_CONTRACT_ADDRESS,
    abi: SonadAbi,
    functionName: 'vote',
  });

  return (
    <div>
      <h3>{post?.content}</h3>
      <p>👍 {post?.litCount.toString()} | 👎 {post?.shitCount.toString()}</p>

      <button
        onClick={() => vote({ args: [postId, true] })}
        disabled={isLoading}
      >
        Vote Lit 🔥
      </button>

      <button
        onClick={() => vote({ args: [postId, false] })}
        disabled={isLoading}
      >
        Vote Shit 💩
      </button>
    </div>
  );
}
```

### **Vue Composition API Example**
```typescript
import { ref, onMounted } from 'vue';
import { createPublicClient, createWalletClient, http } from 'viem';

export function useSonadContract() {
  const posts = ref([]);
  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });

  const getTotalPosts = async () => {
    const total = await client.readContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: 'getTotalPosts',
    });
    return total;
  };

  const vote = async (postId: bigint, isLit: boolean) => {
    // Implementation here
  };

  return { posts, getTotalPosts, vote };
}
```

## 🔧 **Utility Functions**

### **Format Token Amounts**
```typescript
import { formatEther, parseEther } from 'viem';

// Display balance
const balance = 1000000000000000000n; // 1 ETH in wei
console.log(formatEther(balance)); // "1.0"

// Parse user input
const userInput = "0.1";
const amount = parseEther(userInput); // 100000000000000000n
```

### **Type Safety**
```typescript
import { TwitterPost, VoterRewards } from './contract-types';

const post: TwitterPost = await getPostDetails(client, 1n);
const rewards: VoterRewards = await getUserRewards(client, userAddress);
```

## 🎨 **Frontend Framework Integration**

### **wagmi + TanStack Query (React)**
```typescript
import { useContractRead } from 'wagmi';
import { SonadAbi, SONAD_CONTRACT_ADDRESS } from './Sonad-parseAbi';

function PostList() {
  const { data: totalPosts } = useContractRead({
    address: SONAD_CONTRACT_ADDRESS,
    abi: SonadAbi,
    functionName: 'getTotalPosts',
    watch: true, // Real-time updates
  });

  return <div>Total posts: {totalPosts?.toString()}</div>;
}
```

### **Direct viem (Framework agnostic)**
```typescript
import { SonadIntegration } from './integration-examples-parseAbi';

async function main() {
  const { publicClient, walletClient } = await SonadIntegration.init(privateKey);

  // Vote on post
  await SonadIntegration.handleVote(
    walletClient,
    publicClient,
    userAddress,
    1n, // postId
    true // isLit
  );
}
```

## 🌐 **Network Configuration**

```typescript
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz/'] },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
};
```

## 📋 **Best Practices**

1. **Use parseAbi format** for better readability and smaller bundles
2. **Add type safety** with TypeScript interfaces
3. **Handle errors gracefully** with try/catch blocks
4. **Listen to events** for real-time updates
5. **Validate user inputs** before sending transactions
6. **Show transaction status** to users (pending/success/error)

## 🚨 **Common Issues**

### **Gas Estimation Failures**
```typescript
// Simulate first to catch errors
const { request } = await client.simulateContract({
  address: SONAD_CONTRACT_ADDRESS,
  abi: SonadAbi,
  functionName: 'vote',
  args: [postId, isLit],
});

// Then execute
const hash = await client.writeContract(request);
```

### **Insufficient Token Balance**
```typescript
// Check balance before voting
const balance = await client.readContract({
  address: MOCK_MONAD_TOKEN_ADDRESS,
  abi: MockMonadTokenAbi,
  functionName: 'balanceOf',
  args: [userAddress],
});

if (balance < parseEther("1")) {
  throw new Error("Need at least 1 MONAD token to vote");
}
```

## 📞 **Support**

- **Contracts**: Fully verified on Monad testnet
- **Explorer**: https://testnet.monadexplorer.com
- **GitHub**: Your repository with examples
- **Types**: Full TypeScript support included

---
*Happy coding! 🚀*