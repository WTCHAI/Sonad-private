# Sonad Contract Deployment - Monad Testnet

## 🚀 Deployment Summary

**Network:** Monad Testnet
**Chain ID:** 10143
**Deployment Date:** September 20, 2025
**Deployer:** `0x444449108C00Ef513199249c4dFAf9A3Bf644444`

## 📝 Contract Addresses

### Main Contracts
- **Sonad:** `0x96079982fD20Ed66CDEe1A8009058a50727cEBB3`
- **MockMonadToken:** `0x95fCB10fcD03208d3aa468db53433cb23167002D`

### Network Details
- **RPC URL:** `https://testnet-rpc.monad.xyz/`
- **Explorer:** `https://testnet.monadexplorer.com`

## 📋 Contract Functions

### Sonad Contract Features
1. **Post Verification** - `verifyAndRegisterPost(tweetId, creator, content)`
2. **Voting System** - `vote(postId, isLit)` (requires 1+ MONAD tokens)
3. **Tipping** - `tipCreator(postId)` (90% to creator, 10% protocol)
4. **View Functions** - `getPost()`, `getVoterRewards()`, etc.

### MockMonadToken Functions
1. **Faucet** - `faucet()` (gives 100 tokens for testing)
2. **Standard ERC20** - `transfer()`, `balanceOf()`, etc.

## 🔧 Frontend Integration

### Using Web3.js
```javascript
import Web3 from 'web3';
import SonadABI from './Sonad-abi.json';

const web3 = new Web3('https://testnet-rpc.monad.xyz/');
const sonadContract = new web3.eth.Contract(
  SonadABI,
  '0x96079982fD20Ed66CDEe1A8009058a50727cEBB3'
);
```

### Using Ethers.js
```javascript
import { ethers } from 'ethers';
import SonadABI from './Sonad-abi.json';

const provider = new ethers.JsonRpcProvider('https://testnet-rpc.monad.xyz/');
const sonadContract = new ethers.Contract(
  '0x96079982fD20Ed66CDEe1A8009058a50727cEBB3',
  SonadABI,
  provider
);
```

## 📁 Files Included

- `Sonad-abi.json` - Main contract ABI
- `MockMonadToken-abi.json` - Token contract ABI
- `deployment-info.json` - Complete deployment details
- `integration-examples.js` - Frontend integration examples

## 🧪 Testing

### Get Test Tokens
```javascript
// Connect to MockMonadToken and call faucet
await monadToken.faucet(); // Gives 100 MONAD tokens
```

### Vote on a Post
```javascript
// First ensure you have 1+ MONAD tokens
const balance = await monadToken.balanceOf(userAddress);
if (balance >= ethers.parseEther("1")) {
  await sonadContract.vote(postId, true); // true = Lit, false = Shit
}
```

### Tip a Creator
```javascript
await sonadContract.tipCreator(postId, {
  value: ethers.parseEther("0.1") // Tip 0.1 ETH
});
```

## 🔗 Explorer Links

- [Sonad Contract](https://testnet.monadexplorer.com/address/0x96079982fD20Ed66CDEe1A8009058a50727cEBB3)
- [MockMonadToken Contract](https://testnet.monadexplorer.com/address/0x95fCB10fcD03208d3aa468db53433cb23167002D)

## 👥 Team Integration Notes

1. **Frontend Team:** Use the ABI files to interact with contracts
2. **Backend Team:** Use contract addresses for indexing events
3. **Testing:** Use MockMonadToken faucet for test tokens
4. **Production:** Replace MockMonadToken with real MONAD token address

---
*Deployed by Smart Contract Team - Sonad SocialFi Platform*