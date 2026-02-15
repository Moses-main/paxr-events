# Paxr - Decentralized Event Ticketing Marketplace

![Paxr Logo](/public/Paxr_generic.png)

Paxr is a decentralized event ticketing marketplace built on **Arbitrum Orbit**. It enables event organizers to create events and sell NFT-based tickets with built-in anti-scalping protection, resale controls, and group buy functionality.

## Features

- **NFT Ticketing**: All tickets are ERC-721 NFTs with verified ownership
- **Anti-Scalping**: Configurable resale price caps to prevent scalping
- **Group Buy**: Allow attendees to pool together for discounted tickets
- **Cross-Chain Support**: Multi-chain support (Arbitrum One, Arbitrum Sepolia, Ethereum, Polygon)
- **Wallet Connection**: Privy-based wallet integration with easy network switching
- **Real-time Data**: Direct smart contract integration for live event data

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Web3**: Wagmi, Privy
- **Smart Contracts**: Solidity (Arbitrum)
- **Data**: Alchemy RPC for contract reads

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌─────────────┐  │
│  │ Navbar  │  │ Marketplace│  │EventDetail│ │ CreateEvent │  │
│  └────┬────┘  └─────┬────┘  └────┬────┘  └──────┬──────┘  │
│       │             │             │               │          │
│  ┌────┴─────────────┴─────────────┴───────────────┴────┐   │
│  │              Web3Provider (Wagmi + Privy)            │   │
│  └────────────────────────┬────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │  Alchemy RPC  │
                    │ (Arbitrum)    │
                    └───────┬───────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Smart Contracts                           │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │PaxrEvent   │  │ PaxrTicket   │  │ PaxrMarketplace  │  │
│  │(Event Mgmt)│  │ (NFT Tickets)│  │ (Resale/Trading)  │  │
│  └────────────┘  └──────────────┘  └───────────────────┘  │
│                                                               │
│                    Arbitrum Sepolia                          │
└───────────────────────────────────────────────────────────────┘
```

## User Flows

### Create Event Flow
```
Organizer → Connect Wallet → Fill Event Form → Upload Image (IPFS) 
→ Submit Transaction → Event Created on Blockchain → Appears in Marketplace
```

### Buy Ticket Flow
```
User → Browse Marketplace → View Event Details → Connect Wallet 
→ Select Quantity → Mint NFT Ticket → Transaction Confirmed 
→ Ticket Appears in "My Tickets"
```

### Resell Ticket Flow
```
Ticket Owner → My Tickets → Select Ticket → List for Sale 
→ Set Price → Marketplace Listing → Buyer Purchases 
→ Ticket Transferred → Seller Receives Payment
```

## Smart Contracts

| Contract | Address (Arbitrum Sepolia) | Purpose |
|----------|---------------------------|---------|
| PaxrEvent | `0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be` | Event creation & management |
| PaxrTicket | `0x84b9F7f2243a25A1539e25C3E14c097cc2b3F4e6` | NFT ticket minting |
| PaxrMarketplace | `0x802A6843516f52144b3F1D04E5447A085d34aF37` | Ticket resale & trading |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or other Web3 wallet

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following:

```env
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_ARBITRUM_SEPOLIA_RPC=your_alchemy_rpc_url
VITE_PAXR_EVENT_ADDRESS=0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be
VITE_PAXR_TICKET_ADDRESS=0x84b9F7f2243a25A1539e25C3E14c097cc2b3F4e6
VITE_PAXR_MARKETPLACE_ADDRESS=0x802A6843516f52144b3F1D04E5447A085d34aF37
```

### Build

```bash
npm run build
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured events |
| `/marketplace` | Browse all events |
| `/event/:id` | Event details & ticket purchase |
| `/create` | Create new event (organizer) |
| `/my-tickets` | View owned NFT tickets |

## Supported Networks

- **Arbitrum One** (Mainnet)
- **Arbitrum Sepolia** (Testnet)
- **Ethereum** (Mainnet)
- **Polygon** (Mainnet)

## Roadmap

### Phase 5: Privacy & Cross-Chain
- [ ] Fhenix integration for encrypted attendee data
- [ ] Anonymous RSVP system
- [ ] LayerZero cross-chain ticket bridging
- [ ] Group buy functionality

### Phase 6: Social Features
- [ ] Fan communities section
- [ ] Referral system
- [ ] Shareable attendance proofs

### Phase 7: Analytics & Dashboard
- [ ] Dune Analytics integration
- [ ] Organizer dashboard
- [ ] Payment analytics

### Phase 8: Testing & Deployment
- [ ] Unit tests
- [ ] Mainnet deployment
- [ ] Production setup

## License

MIT
