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
  event: import.meta.env.VITE_PAXR_EVENT_ADDRESS || '0xA076ecA49434a4475a9FF716c2E9f20ccc453c20',
  ticket: import.meta.env.VITE_PAXR_TICKET_ADDRESS || '0x24AaD9a08F7e8C11F3B62a68Acbd5D74D2FfA225',
  marketplace: import.meta.env.VITE_PAXR_MARKETPLACE_ADDRESS || '0xb0d900AeE4f0D163dB34BAf239f9885F38bD1EDe',
}

export const TOKENS = {
  ETH: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, name: 'Ethereum' },
  USDC: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
}

export const CHAIN_ID = import.meta.env.DEV ? arbitrumSepolia.id : arbitrum.id
