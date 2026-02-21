import { http, createConfig } from 'wagmi'
import { mainnet, arbitrum, arbitrumSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, arbitrum, arbitrumSepolia],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc'),
  },
})

export const CONTRACT_ADDRESSES = {
  event: import.meta.env.VITE_PAXR_EVENT_ADDRESS || '0x3b8031f14005c38ECcAC22949d426F279A661690',
  ticket: import.meta.env.VITE_PAXR_TICKET_ADDRESS || '0x2EE6d7C062afB4673dcd2000eEe06bcEacBe5788',
  marketplace: import.meta.env.VITE_PAXR_MARKETPLACE_ADDRESS || '0x8f77c2BD2132727327B27164cDec4ccaA2083f7C',
}

export const TOKENS = {
  ETH: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
  USDC: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
}

export const CHAIN_ID = import.meta.env.DEV ? arbitrumSepolia.id : arbitrum.id
