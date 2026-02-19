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
  event: import.meta.env.VITE_PAXR_EVENT_ADDRESS || '0x9397eBE8d5235fb818736eA8b2c90c3a51c5d278',
  ticket: import.meta.env.VITE_PAXR_TICKET_ADDRESS || '0x47F40AC7982Fd70f2eCF633e57d2A347a5116289',
  marketplace: import.meta.env.VITE_PAXR_MARKETPLACE_ADDRESS || '0x4e9A9676B3E24E406a42710A06120561D5A9A045',
}

export const TOKENS = {
  ETH: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
  USDC: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
}

export const CHAIN_ID = import.meta.env.DEV ? arbitrumSepolia.id : arbitrum.id
