// MockMonadToken Contract ABI in parseAbi format
// Address: 0x95fCB10fcD03208d3aa468db53433cb23167002D
// Network: Monad Testnet

export const MockMonadTokenAbi = [
  // Constructor
  "constructor()",

  // Events
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",

  // Read Functions
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
  "function owner() view returns (address)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",

  // Write Functions
  "function approve(address spender, uint256 value) returns (bool)",
  "function faucet()",
  "function mint(address to, uint256 amount)",
  "function renounceOwnership()",
  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
  "function transferOwnership(address newOwner)"
] as const;

// Contract Constants
export const MOCK_MONAD_TOKEN_ADDRESS = "0x95fCB10fcD03208d3aa468db53433cb23167002D" as const;
export const FAUCET_AMOUNT = "100000000000000000000"; // 100 tokens in wei
export const TOKEN_DECIMALS = 18;
export const TOKEN_NAME = "Mock Monad Token";
export const TOKEN_SYMBOL = "MONAD";