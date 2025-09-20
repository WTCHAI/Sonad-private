import { QueryClient, useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

export const refreshTokenBalances = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    predicate: (query) => query.queryKey[0] === "token-balances",
  })
}

export const useTokenBalances = () => {
  const { address } = useAccount()
  return useQuery({
    queryKey: ["token-balances", address],
    queryFn: async () => {
      if (!address) return { usdc: 0, weth: 0 }

      return {
        usdc: Number(results[0].result) / 1e6,
        weth: Number(results[1].result) / 1e6,
      }
    },
    refetchInterval: 1000 * 30, // 30 seconds
  })
}
