"use client"

import React from "react"
import {
  PrivyProvider as BasePrivyProvider,
  PrivyClientConfig,
} from "@privy-io/react-auth"

import { env } from "@/env.mjs"

export default function PrivyProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const config: PrivyClientConfig = {
    loginMethods: ["twitter"],
    appearance: {
      theme: "dark",
      walletChainType: "ethereum-only",
    },
    defaultChain: {
      id: 41454,
      name: "Monad Testnet",
      network: "monad-testnet",
      nativeCurrency: {
        decimals: 18,
        name: "Monad",
        symbol: "MON",
      },
      rpcUrls: {
        default: {
          http: ["https://testnet1.monad.xyz"],
        },
        public: {
          http: ["https://testnet1.monad.xyz"],
        },
      },
      blockExplorers: {
        default: {
          name: "Monad Explorer",
          url: "https://explorer-testnet.monad.xyz",
        },
      },
    },
    supportedChains: [
      {
        id: 41454,
        name: "Monad Testnet",
        network: "monad-testnet",
        nativeCurrency: {
          decimals: 18,
          name: "Monad",
          symbol: "MON",
        },
        rpcUrls: {
          default: {
            http: ["https://testnet1.monad.xyz"],
          },
          public: {
            http: ["https://testnet1.monad.xyz"],
          },
        },
        blockExplorers: {
          default: {
            name: "Monad Explorer",
            url: "https://explorer-testnet.monad.xyz",
          },
        },
      },
    ],
  }

  return (
    <BasePrivyProvider appId={env.NEXT_PUBLIC_PRIVY_APP_ID} config={config}>
      {children}
    </BasePrivyProvider>
  )
}
