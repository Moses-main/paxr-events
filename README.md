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
| PaxrEvent | `0xc880af5d5ac3ea27c26c47d132661a710c245ea5` | Event creation & management |
| PaxrTicket | `0xcbf17d67bd0ee803e68dff35fa8e675aa3abad47` | NFT ticket minting |
| PaxrMarketplace | `0x62f0be8a94f7e348f15f6f373e35ae5c34f7d40f` | Ticket resale & trading |

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
VITE_PAXR_EVENT_ADDRESS=0xc880af5d5ac3ea27c26c47d132661a710c245ea5
VITE_PAXR_TICKET_ADDRESS=0xcbf17d67bd0ee803e68dff35fa8e675aa3abad47
VITE_PAXR_MARKETPLACE_ADDRESS=0x62f0be8a94f7e348f15f6f373e35ae5c34f7d40f
```

### Build

```bash
npm run build
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured events & CTA |
| `/how-it-works` | How it works guide page |
| `/marketplace` | Browse all events |
| `/event/:id` | Event details & ticket purchase |
| `/create` | Create new event (organizer) |
| `/my-tickets` | View owned NFT tickets |
| `/communities` | Fan communities (real event data) |
| `/community/:id` | Community details |
| `/dashboard` | Organizer dashboard & analytics |

## Completed Features

### Core
- [x] NFT Ticketing with ERC-721
- [x] Anti-scalping resale caps
- [x] Group buy functionality
- [x] Multi-chain wallet connection (Privy)
- [x] Real-time contract data (Alchemy)
- [x] IPFS image uploads

### Pages & UI
- [x] Homepage with featured events (from contract)
- [x] Create Event button with attractive rounded design
- [x] How It Works guide page
- [x] Marketplace with all events
- [x] Event Detail page with live data
- [x] My Tickets page
- [x] Communities page (now uses real event data)
- [x] Community Detail page
- [x] Organizer Dashboard with analytics

### Social & Privacy
- [x] Anonymous RSVP
- [x] Referral system
- [x] Attendance proofs
- [x] Fan communities

### Analytics
- [x] Dune Analytics integration
- [x] Payment analytics

## Remaining Tasks

### Testing & Deployment
- [ ] Unit tests for smart contracts
- [ ] Integration tests for frontend
- [ ] Mainnet deployment
- [ ] Production optimization (code splitting)

### Future Enhancements
- [ ] Fhenix encrypted attendee data
- [ ] LayerZero cross-chain bridging
- [ ] Mobile app

## Roadmap

For a detailed timeline and feature breakdown, see [ROADMAP.md](./ROADMAP.md).

### Quick Overview

| Quarter | Focus |
|---------|-------|
| Q1 2026 | Mainnet Launch, Core Features |
| Q2 2026 | Growth, Referral System, Mobile |
| Q3 2026 | Privacy (Fhenix), Cross-Chain |
| Q4 2026 | PAXR Token, DAO, Rewards |
| 2027 | Enterprise, White-Label, API |
| 2028 | Mobile Apps, Global Scale |

### Detailed Milestones

**2026**
- ✅ Foundation: Smart contracts deployed on Arbitrum Sepolia
- ✅ NFT Ticketing, Anti-Scalping, Group Buy
- ✅ Frontend MVP complete
- 🔄 Testing & Audits
- ⏳ Mainnet Launch

**2027**
- White-Label Platform
- Enterprise Contracts
- Public API

**2028**
- Native Mobile Apps
- Global Payments (50+ countries)
- Metaverse Integration

### Success Metrics

| Metric | 2026 | 2027 | 2028 |
|--------|------|------|------|
| Events | 500 | 5,000 | 50,000 |
| Users | 1,000 | 50,000 | 1M |
| Revenue | $50K | $2M | $20M |

## License

MIT
