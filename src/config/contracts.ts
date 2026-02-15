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
  event: import.meta.env.VITE_PAXR_EVENT_ADDRESS || '0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be',
  ticket: import.meta.env.VITE_PAXR_TICKET_ADDRESS || '0x84b9F7f2243a25A1539e25C3E14c097cc2b3F4e6',
  marketplace: import.meta.env.VITE_PAXR_MARKETPLACE_ADDRESS || '0x802A6843516f52144b3F1D04E5447A085d34aF37',
}

export const CHAIN_ID = import.meta.env.DEV ? arbitrumSepolia.id : arbitrum.id
