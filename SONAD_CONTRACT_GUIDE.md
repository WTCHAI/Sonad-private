# Sonad Smart Contract Guide

## Overview

Sonad is a SocialFi application smart contract for the Monad blockchain that enables Twitter/X post verification, voting, and rewards system.

## Features

### 1. Post Verification & Registration
- Verify ownership of Twitter posts tagged with $Monad or $NAD
- Store verified posts on-chain with metadata
- Each post gets a unique ID and is linked to creator's address

### 2. Voting System (Lit/Shit)
- Users can vote "Lit" (upvote) or "Shit" (downvote) on posts
- Requires minimum 1 MONAD token holding (configurable by admin)
- Prevents double voting
- Tracks vote counts per post

### 3. RNG Rewards System
- Voters receive 10 points per vote
- 1% chance to receive an NFT reward when voting
- Uses blockchain randomness (block.timestamp + block.prevrandao)

### 4. Tip Mechanism
- Users can tip post creators with ETH/native tokens
- 90% goes to creator, 10% to protocol
- Tips are tracked per post

## Contract Architecture

### Main Contracts
- `Sonad.sol` - Main contract with all features
- `MockMonadToken.sol` - Mock ERC20 token for testing

### Key Structs
```solidity
struct TwitterPost {
    string tweetId;
    address creator;
    string content;
    uint256 timestamp;
    uint256 litCount;
    uint256 shitCount;
    uint256 totalTips;
    bool verified;
    bool active;
}
```

## Deployment

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Compile contracts:**
   ```bash
   yarn hardhat:compile
   ```

3. **Run tests:**
   ```bash
   yarn hardhat:test
   ```

4. **Deploy to local network:**
   ```bash
   yarn hardhat:chain  # In separate terminal
   yarn hardhat:deploy
   ```

## Usage Examples

### Register a Post (Admin only)
```solidity
sonad.verifyAndRegisterPost(
    "1234567890",           // Tweet ID
    "0x123...",             // Creator address
    "Great post about #Monad!"  // Content
);
```

### Vote on a Post
```solidity
sonad.vote(1, true);  // Vote "Lit" on post ID 1
sonad.vote(1, false); // Vote "Shit" on post ID 1
```

### Tip a Creator
```solidity
sonad.tipCreator{value: 1 ether}(1);  // Tip 1 ETH to post ID 1 creator
```

### Check Voter Rewards
```solidity
(uint256 points, uint256 nftCount) = sonad.getVoterRewards(voterAddress);
```

## Admin Functions

### Update Minimum Holding
```solidity
sonad.updateMinimumMonadHolding(5 * 10**18);  // Set to 5 MONAD tokens
```

### Deactivate Post
```solidity
sonad.deactivatePost(1);  // Deactivate post ID 1
```

### Withdraw Protocol Fees
```solidity
sonad.withdrawProtocolFees();  // Withdraw accumulated tips fees
```

## Testing

The test suite covers:
- ✅ Post verification and registration
- ✅ Voting with token requirements
- ✅ Tipping mechanism
- ✅ Admin functions
- ✅ View functions
- ✅ Error conditions

Run tests:
```bash
cd packages/hardhat
yarn test
```

## Security Features

- ✅ Reentrancy protection on voting and tipping
- ✅ Ownership controls for admin functions
- ✅ Token balance validation for voting
- ✅ Duplicate vote prevention
- ✅ Safe ETH transfers

## Constants

- `POINTS_PER_VOTE = 10` - Points awarded per vote
- `NFT_DROP_CHANCE = 100` - 1/100 chance for NFT drop
- `TIP_CREATOR_PERCENTAGE = 90` - 90% of tips go to creator

## Events

- `PostVerified(postId, tweetId, creator)`
- `VoteCast(postId, voter, isLit, points, nftAwarded)`
- `TipSent(postId, tipper, amount)`
- `NFTMinted(recipient, tokenId)`
- `MinimumHoldingUpdated(newMinimum)`

## Integration with Frontend

The contract is designed to work with Scaffold-ETH 2 frontend. Key integration points:

1. **Post Display**: Use `getPost(postId)` and `getTotalPosts()`
2. **Voting Interface**: Check `hasUserVoted()` before showing vote buttons
3. **Rewards Display**: Show `getVoterRewards()` in user profile
4. **Creator Dashboard**: Use `getCreatorPosts()` to show creator's posts

## Next Steps

1. Deploy to Monad testnet
2. Integrate with Twitter API for post verification
3. Create frontend interface
4. Add governance features
5. Implement staking mechanisms