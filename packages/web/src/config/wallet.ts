import { cookieStorage, createConfig, createStorage, http } from "wagmi"
import { monadTestnet } from "wagmi/chains"

export const config = createConfig({
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [monadTestnet.id]: http(),
  },
  chains: [monadTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
  batch: {
    multicall: true,
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
