// Sonad Contract ABI in parseAbi format
// Address: 0x96079982fD20Ed66CDEe1A8009058a50727cEBB3
// Network: Monad Testnet

export const SonadAbi = [
  // Constructor
  "constructor(address _monadToken)",

  // Events
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  "event MinimumHoldingUpdated(uint256 newMinimum)",
  "event NFTMinted(address indexed recipient, uint256 tokenId)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
  "event PostVerified(uint256 indexed postId, string tweetId, address indexed creator)",
  "event TipSent(uint256 indexed postId, address indexed tipper, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event VoteCast(uint256 indexed postId, address indexed voter, bool isLit, uint256 points, bool nftAwarded)",

  // Read Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function creatorPosts(address, uint256) view returns (uint256)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function getCreatorPosts(address _creator) view returns (uint256[])",
  "function getPost(uint256 _postId) view returns (tuple(string tweetId, address creator, string content, uint256 timestamp, uint256 litCount, uint256 shitCount, uint256 totalTips, bool verified, bool active))",
  "function getTotalPosts() view returns (uint256)",
  "function getVoterRewards(address _voter) view returns (uint256 points, uint256 nftCount)",
  "function hasUserVoted(address _user, uint256 _postId) view returns (bool)",
  "function hasVoted(address, uint256) view returns (bool)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function minimumMonadHolding() view returns (uint256)",
  "function monadToken() view returns (address)",
  "function name() view returns (string)",
  "function nextTokenId() view returns (uint256)",
  "function owner() view returns (address)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function postIdCounter() view returns (uint256)",
  "function posts(uint256) view returns (tuple(string tweetId, address creator, string content, uint256 timestamp, uint256 litCount, uint256 shitCount, uint256 totalTips, bool verified, bool active))",
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function tweetIdToPostId(string) view returns (uint256)",
  "function voterRewards(address) view returns (tuple(uint256 points, uint256 nftCount, bool hasVoted))",

  // Write Functions
  "function approve(address to, uint256 tokenId)",
  "function deactivatePost(uint256 _postId)",
  "function renounceOwnership()",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)",
  "function setApprovalForAll(address operator, bool approved)",
  "function setMonadToken(address _newMonadToken)",
  "function tipCreator(uint256 _postId) payable",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function transferOwnership(address newOwner)",
  "function updateMinimumMonadHolding(uint256 _newMinimum)",
  "function verifyAndRegisterPost(string _tweetId, address _creator, string _content) returns (uint256)",
  "function vote(uint256 _postId, bool _isLit)",
  "function withdrawProtocolFees()",

  // Receive Function
  "receive() external payable"
] as const;

// Contract Constants
export const SONAD_CONTRACT_ADDRESS = "0x96079982fD20Ed66CDEe1A8009058a50727cEBB3" as const;
export const POINTS_PER_VOTE = 10;
export const NFT_DROP_CHANCE = 100; // 1% chance
export const TIP_CREATOR_PERCENTAGE = 90; // 90% to creator

// TypeScript types for better development experience
export type TwitterPost = {
  tweetId: string;
  creator: string;
  content: string;
  timestamp: bigint;
  litCount: bigint;
  shitCount: bigint;
  totalTips: bigint;
  verified: boolean;
  active: boolean;
};

export type VoterReward = {
  points: bigint;
  nftCount: bigint;
  hasVoted: boolean;
};