import { getAccount } from "@wagmi/core"
import { Address, createPublicClient, http, parseAbi } from "viem"
import { monadTestnet } from "viem/chains"

export const SepoliaContract = {
  youngGuRuPikadProxy: "0x" as Address,
}

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})



export const YOUNG_GU_RU_PIKAD_PROXY_ABI = parseAbi([
  // Events
  "event AdminChanged(address indexed previousAdmin, address indexed newAdmin)",
  "event DekGenProof(bytes32 indexed _key, address indexed _verifier, address indexed _prover, bool _result)",
  "event MiaGenProof(bytes32 indexed _key, address indexed _verifier, address indexed _prover, bool _result)",
  "event OwnerShipTransferred(address indexed previousOwner, address indexed newOwner)",
  "event Paused(address account)",
  "event Unpaused(address account)",
  "event VerifierConfigured(bytes32 indexed key, address indexed verifier, address indexed authority)",

  // Functions
  "function configVerifier(bytes32 _key, address _verifier)",
  "function getAdmin() view returns (address)",
  "function getOwner() view returns (address)",
  "function getPause() view returns (bool)",
  "function initialize(address _owner, address _admin)",
  "function initialized() view returns (bool)",
  "function provers(bytes32, address) view returns (bool)",
  "function setAdmin(address newAdmin)",
  "function transferOwnership(address newOwner)",
  "function verifierConfiguration(bytes32 _key, address _verifier)",
  "function verifiers(bytes32) view returns (address)",
  "function verifyDek(bytes32 _key, bytes _proof, bytes32[] _publicInputs) returns (bool)",
  "function verifyMia(bytes32 _key, bytes _proof, bytes32[] _publicInputs) returns (bool)",
])

export const contracts = {
  youngGuRuPikadProxy: ,
}
