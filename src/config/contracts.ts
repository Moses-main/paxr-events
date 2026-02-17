import { http, createConfig } from 'wagmi'
import { mainnet, arbitrum, arbitrumSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, arbitrum, arbitrumSepolia],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC || 'https://arb-sepolia.g.alchemy.com/v2/demo'),
  },
})

export const CONTRACT_ADDRESSES = {
  event: import.meta.env.VITE_PAXR_EVENT_ADDRESS || '0xc880af5d5ac3ea27c26c47d132661a710c245ea5',
  ticket: import.meta.env.VITE_PAXR_TICKET_ADDRESS || '0xcbf17d67bd0ee803e68dff35fa8e675aa3abad47',
  marketplace: import.meta.env.VITE_PAXR_MARKETPLACE_ADDRESS || '0x62f0be8a94f7e348f15f6f373e35ae5c34f7d40f',
}

export const TOKENS = {
  ETH: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
  USDC: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
}

export const CHAIN_ID = import.meta.env.DEV ? arbitrumSepolia.id : arbitrum.id
