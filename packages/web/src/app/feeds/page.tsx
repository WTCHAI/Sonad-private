"use client"

import { useState } from "react"

import { useSonadContract } from "@/hooks/contract/useSonadContract"
import { useWalletAccount } from "@/hooks/wallet/useWalletAccount"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function FeedsPage() {
  const {
    verifyAndRegisterPost,
    voteOnPost,
    tipCreator,
    deactivatePost,
    isReady,
    contractAddress,
  } = useSonadContract()

  const walletAccount = useWalletAccount()

  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState("")

  // Form states
  const [tweetId, setTweetId] = useState("")
  const [content, setContent] = useState("")
  const [postId, setPostId] = useState("")
  const [tipAmount, setTipAmount] = useState("")

  const handleRegisterPost = async () => {
    if (!isReady || !tweetId || !content) return

    setIsLoading(true)
    setTxHash("")

    try {
      const hash = await verifyAndRegisterPost(
        tweetId,
        walletAccount.address as `0x${string}`,
        content
      )
      setTxHash(hash)
      console.log(" Post registered:", hash)

      // Clear form
      setTweetId("")
      setContent("")
    } catch (error) {
      console.error("L Register post failed:", error)
      alert("Failed to register post!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoteLit = async () => {
    if (!isReady || !postId) return

    setIsLoading(true)
    setTxHash("")

    try {
      const hash = await voteOnPost(parseInt(postId), true) // true = LIT
      setTxHash(hash)
      console.log("=% Voted LIT:", hash)
    } catch (error) {
      console.error("L Vote LIT failed:", error)
      alert("Failed to vote LIT!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoteShit = async () => {
    if (!isReady || !postId) return

    setIsLoading(true)
    setTxHash("")

    try {
      const hash = await voteOnPost(parseInt(postId), false) // false = SHIT
      setTxHash(hash)
      console.log("=� Voted SHIT:", hash)
    } catch (error) {
      console.error("L Vote SHIT failed:", error)
      alert("Failed to vote SHIT!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTipCreator = async () => {
    if (!isReady || !postId || !tipAmount) return

    setIsLoading(true)
    setTxHash("")

    try {
      const hash = await tipCreator(parseInt(postId), tipAmount)
      setTxHash(hash)
      console.log("=� Tip sent:", hash)

      // Clear tip amount
      setTipAmount("")
    } catch (error) {
      console.error("L Tip failed:", error)
      alert("Failed to send tip!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeactivatePost = async () => {
    if (!isReady || !postId) return

    setIsLoading(true)
    setTxHash("")

    try {
      const hash = await deactivatePost(parseInt(postId))
      setTxHash(hash)
      console.log("=� Post deactivated:", hash)
    } catch (error) {
      console.error("L Deactivate failed:", error)
      alert("Failed to deactivate post!")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTxHash = (hash: string) => {
    if (!hash) return ""
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  const getExplorerUrl = (hash: string) => {
    return `https://explorer-testnet.monad.xyz/tx/${hash}`
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sonad Feeds Demo</h1>
        <p className="text-muted-foreground">
          Test Sonad contract interactions on Monad Testnet
        </p>
      </div>

      {/* Wallet Status */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            <Badge
              variant={
                walletAccount.state === "connected" ? "default" : "secondary"
              }
            >
              {walletAccount.state}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Address:</span>
            <code className="bg-muted rounded px-2 py-1 text-xs">
              {walletAccount.address
                ? formatTxHash(walletAccount.address)
                : "Not connected"}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Contract:</span>
            <code className="bg-muted rounded px-2 py-1 text-xs">
              {formatTxHash(contractAddress)}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Ready:</span>
            <Badge variant={isReady ? "default" : "secondary"}>
              {isReady ? "Yes" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Register New Post */}
      <Card>
        <CardHeader>
          <CardTitle>=� Register Twitter Post</CardTitle>
          <CardDescription>
            Register a Twitter post on-chain with verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Tweet ID (e.g., 1234567890)"
            value={tweetId}
            onChange={(e) => setTweetId(e.target.value)}
          />
          <Input
            placeholder="Post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            onClick={handleRegisterPost}
            disabled={!isReady || isLoading || !tweetId || !content}
            className="w-full"
          >
            {isLoading ? "Registering..." : "Register Post"}
          </Button>
        </CardContent>
      </Card>

      {/* Voting */}
      <Card>
        <CardHeader>
          <CardTitle>=� Vote on Posts</CardTitle>
          <CardDescription>
            Vote LIT =% or SHIT =� on existing posts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Post ID (e.g., 1, 2, 3...)"
            type="number"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleVoteLit}
              disabled={!isReady || isLoading || !postId}
              className="bg-orange-500 hover:bg-orange-600"
            >
              =% Vote LIT
            </Button>
            <Button
              onClick={handleVoteShit}
              disabled={!isReady || isLoading || !postId}
              variant="destructive"
            >
              =� Vote SHIT
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tipping */}
      <Card>
        <CardHeader>
          <CardTitle>=� Tip Creator</CardTitle>
          <CardDescription>Send MON tokens to support creators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Post ID"
              type="number"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
            />
            <Input
              placeholder="Amount (MON)"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
            />
          </div>
          <Button
            onClick={handleTipCreator}
            disabled={!isReady || isLoading || !postId || !tipAmount}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            {isLoading ? "Sending..." : "Send Tip"}
          </Button>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>� Admin Actions</CardTitle>
          <CardDescription>
            Administrative functions (owner/creator only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Post ID to deactivate"
            type="number"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
          />
          <Button
            onClick={handleDeactivatePost}
            disabled={!isReady || isLoading || !postId}
            variant="outline"
            className="w-full"
          >
            {isLoading ? "Deactivating..." : "Deactivate Post"}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction Result */}
      {txHash && (
        <Card>
          <CardHeader>
            <CardTitle> Transaction Successful</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Hash:</span>
              <code className="bg-muted rounded px-2 py-1 text-xs">
                {formatTxHash(txHash)}
              </code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(getExplorerUrl(txHash), "_blank")}
            >
              View on Explorer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground text-sm">
              Transaction in progress... Check console for details.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
