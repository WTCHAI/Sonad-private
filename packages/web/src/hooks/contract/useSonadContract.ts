import { Address, parseEther } from "viem"

import { contracts, SonadAbi } from "@/lib/contract"

import { useContractInteractionV2 } from "../wallet/useWalletAccount"

export const useSonadContract = () => {
  const { callContract, walletAccount, isReady } = useContractInteractionV2()

  // Use the deployed contract address from contracts
  const SONAD_CONTRACT_ADDRESS = contracts.SonadContract

  // Post verification and registration
  const verifyAndRegisterPost = async (
    tweetId: string,
    creator: Address,
    content: string
  ) => {
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "verifyAndRegisterPost",
      args: [tweetId, creator, content],
    })
  }

  // Vote on a post (lit or shit)
  const voteOnPost = async (postId: number, isLit: boolean) => {
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "vote",
      args: [postId, isLit],
    })
  }

  // Tip a creator with MON
  const tipCreator = async (postId: number, tipAmount: string) => {
    const value = parseEther(tipAmount) // Convert string to wei
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "tipCreator",
      args: [postId],
      value,
    })
  }

  // Deactivate a post (only by creator or owner)
  const deactivatePost = async (postId: number) => {
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "deactivatePost",
      args: [postId],
    })
  }

  // Update minimum MON holding requirement (only owner)
  const updateMinimumMonadHolding = async (newMinimum: string) => {
    const minimumWei = parseEther(newMinimum)
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "updateMinimumMonadHolding",
      args: [minimumWei],
    })
  }

  // Set new MON token address (only owner)
  const setMonadToken = async (newTokenAddress: Address) => {
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "setMonadToken",
      args: [newTokenAddress],
    })
  }

  // Withdraw protocol fees (only owner)
  const withdrawProtocolFees = async () => {
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "withdrawProtocolFees",
      args: [],
    })
  }

  // Transfer ownership (only owner)
  const transferOwnership = async (newOwner: Address) => {
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "transferOwnership",
      args: [newOwner],
    })
  }

  // NFT functions
  const approveNFT = async (to: Address, tokenId: number) => {
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "approve",
      args: [to, tokenId],
    })
  }

  const transferNFT = async (from: Address, to: Address, tokenId: number) => {
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "transferFrom",
      args: [from, to, tokenId],
    })
  }

  const setApprovalForAll = async (operator: Address, approved: boolean) => {
    return callContract({
      address: SONAD_CONTRACT_ADDRESS,
      abi: SonadAbi,
      functionName: "setApprovalForAll",
      args: [operator, approved],
    })
  }

  return {
    // Contract interactions
    verifyAndRegisterPost,
    voteOnPost,
    tipCreator,
    deactivatePost,
    updateMinimumMonadHolding,
    setMonadToken,
    withdrawProtocolFees,
    transferOwnership,

    // NFT functions
    approveNFT,
    transferNFT,
    setApprovalForAll,

    // Wallet state
    walletAccount,
    isReady,
    contractAddress: SONAD_CONTRACT_ADDRESS,
  }
}
