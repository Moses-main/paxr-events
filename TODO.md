# Paxr - Development Roadmap

## Phase 1: Foundation & Smart Contracts
- [x] Initialize Foundry project structure
- [x] Set up environment variables (.env.example template)
- [x] Deploy core NFT ticket contract (ERC-721)
- [x] Implement event contract with ticket minting
- [x] Add anti-fraud & anti-scalping rules
- [x] Implement resale marketplace contract
- [ ] Add LayerZero integration for cross-chain bridging (Phase 5)
- [ ] Configure Fhenix encryption helpers (Phase 5)
- [ ] Write unit tests for contracts
- [x] Deploy to Arbitrum Sepolia testnet

## Deployed Contracts (Arbitrum Sepolia)
- PaxrEvent: `0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be`
- PaxrTicket: `0x84b9F7f2243a25A1539e25C3E14c097cc2b3F4e6`
- PaxrMarketplace: `0x802A6843516f52144b3F1D04E5447A085d34aF37`

## Phase 2: Frontend Foundation
- [x] Set up Vite + React
- [x] Integrate Privy wallet connection
- [x] Create global layout with Copperx-inspired design
- [x] Build wallet connection modal
- [ ] Implement transaction status tracker component
- [x] Set up Wagmi/viem for contract interactions
- [x] Configure Alchemy RPC for event indexing
- [ ] Set up Alchemy SDK for event listening/indexing

## Phase 3: Event Management
- [ ] Build event creation form (Copperx payment link style)
- [ ] Implement IPFS upload for event metadata
- [ ] Create event listing/marketplace page
- [ ] Build event detail page with ticket purchase
- [ ] Implement ticket checkout flow
- [ ] Add minting progress indicators

## Phase 4: Ticket System
- [ ] Implement ticket NFT display (My Tickets page)
- [ ] Build ticket transfer functionality
- [ ] Add resale listing feature
- [ ] Implement price cap enforcement
- [ ] Create ticket verification/attendance system

## Phase 5: Privacy & Cross-Chain
- [ ] Integrate Fhenix for encrypted attendee data
- [ ] Implement anonymous RSVP system
- [ ] Add LayerZero cross-chain ticket bridging
- [x] Build group buy functionality

## Phase 6: Social Features
- [ ] Create fan communities section
- [ ] Implement referral system
- [ ] Add shareable attendance proofs
- [ ] Build user dashboard with analytics

## Phase 7: Analytics & Dashboard
- [ ] Integrate Dune Analytics API
- [ ] Build organizer dashboard
- [ ] Create payment analytics
- [ ] Add event demand metrics

## Phase 8: Testing & Deployment
- [ ] Run comprehensive test suite
- [ ] Audit smart contracts
- [ ] Deploy to Arbitrum mainnet
- [ ] Set up IPFS pinning service
- [ ] Configure production environment
- [ ] Launch marketing landing page
