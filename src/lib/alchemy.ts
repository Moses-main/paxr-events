import { createPublicClient, http, PublicClient, getContract } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

const publicClient: PublicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc'),
});

export interface EventData {
  eventId: number;
  name: string;
  description: string;
  imageURI: string;
  location: string;
  ticketPrice: string;
  totalTickets: number;
  ticketsSold: number;
  eventDate: number;
  saleStartTime: number;
  saleEndTime: number;
  organizer: string;
  paymentToken: string;
  isActive: boolean;
  resaleEnabled: boolean;
  maxResalePrice: string;
  platformFeePercent: string;
  groupBuyDiscount: string;
}

export interface TicketData {
  eventId: number;
  purchasePrice: string;
  purchaseTime: number;
  originalBuyer: string;
  isUsed: boolean;
}

export interface Listing {
  seller: string;
  tokenId: number;
  price: string;
  eventId: number;
  listingTime: number;
  active: boolean;
}

const EVENT_ABI = [
  {
    name: 'eventCount',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'events',
    type: 'function',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'imageURI', type: 'string' },
      { name: 'location', type: 'string' },
      { name: 'ticketPrice', type: 'uint256' },
      { name: 'totalTickets', type: 'uint256' },
      { name: 'ticketsSold', type: 'uint256' },
      { name: 'eventDate', type: 'uint256' },
      { name: 'saleStartTime', type: 'uint256' },
      { name: 'saleEndTime', type: 'uint256' },
      { name: 'organizer', type: 'address' },
      { name: 'paymentToken', type: 'address' },
      { name: 'isActive', type: 'bool' },
      { name: 'resaleEnabled', type: 'bool' },
      { name: 'maxResalePrice', type: 'uint256' },
      { name: 'platformFeePercent', type: 'uint256' },
      { name: 'groupBuyDiscount', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    name: 'eventExists',
    type: 'function',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'EventCreated',
    inputs: [
      { name: 'eventId', type: 'uint256', indexed: true },
      { name: 'organizer', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'TicketPurchased',
    inputs: [
      { name: 'eventId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256' },
    ],
  },
] as const;

const TICKET_ABI = [
  {
    name: 'ticketData',
    type: 'function',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'eventId', type: 'uint256' },
      { name: 'purchasePrice', type: 'uint256' },
      { name: 'purchaseTime', type: 'uint256' },
      { name: 'originalBuyer', type: 'address' },
      { name: 'isUsed', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'tokenOfOwnerByIndex',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'tokenURI',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
] as const;

const MARKETPLACE_ABI = [
  {
    name: 'listings',
    type: 'function',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'seller', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'price', type: 'uint256' },
      { name: 'eventId', type: 'uint256' },
      { name: 'listingTime', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'TicketListed',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
      { name: 'price', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'TicketSold',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'price', type: 'uint256' },
    ],
  },
] as const;

export async function getEventCount(): Promise<number> {
  const count = await publicClient.readContract({
    address: CONTRACT_ADDRESSES.event as `0x${string}`,
    abi: EVENT_ABI,
    functionName: 'eventCount',
  });
  return Number(count);
}

export async function getEvent(eventId: number): Promise<EventData | null> {
  try {
    const exists = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.event as `0x${string}`,
      abi: EVENT_ABI,
      functionName: 'eventExists',
      args: [BigInt(eventId)],
    });

    if (!exists) return null;

    const event = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.event as `0x${string}`,
      abi: EVENT_ABI,
      functionName: 'events',
      args: [BigInt(eventId)],
    });

    return {
      eventId,
      name: event[0],
      description: event[1],
      imageURI: event[2],
      location: event[3],
      ticketPrice: event[4].toString(),
      totalTickets: Number(event[5]),
      ticketsSold: Number(event[6]),
      eventDate: Number(event[7]),
      saleStartTime: Number(event[8]),
      saleEndTime: Number(event[9]),
      organizer: event[10],
      paymentToken: event[11],
      isActive: event[12],
      resaleEnabled: event[13],
      maxResalePrice: event[14].toString(),
      platformFeePercent: event[15].toString(),
      groupBuyDiscount: event[16].toString(),
    };
  } catch {
    return null;
  }
}

export async function getAllEvents(): Promise<EventData[]> {
  const count = await getEventCount();
  const events: EventData[] = [];

  for (let i = 1; i <= count; i++) {
    const event = await getEvent(i);
    if (event) {
      events.push(event);
    }
  }

  return events;
}

export async function getActiveEvents(): Promise<EventData[]> {
  const allEvents = await getAllEvents();
  const now = Math.floor(Date.now() / 1000);
  return allEvents.filter(
    (event) =>
      event.isActive &&
      event.saleStartTime <= now &&
      event.saleEndTime >= now &&
      event.ticketsSold < event.totalTickets
  );
}

export async function getTicketData(tokenId: number): Promise<TicketData | null> {
  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.ticket as `0x${string}`,
      abi: TICKET_ABI,
      functionName: 'ticketData',
      args: [BigInt(tokenId)],
    });

    return {
      eventId: Number(data[0]),
      purchasePrice: data[1].toString(),
      purchaseTime: Number(data[2]),
      originalBuyer: data[3],
      isUsed: data[4],
    };
  } catch {
    return null;
  }
}

export async function getUserTickets(userAddress: string): Promise<number[]> {
  try {
    const balance = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.ticket as `0x${string}`,
      abi: TICKET_ABI,
      functionName: 'balanceOf',
      args: [userAddress as `0x${string}`],
    });

    const tickets: number[] = [];
    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.ticket as `0x${string}`,
        abi: TICKET_ABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [userAddress as `0x${string}`, BigInt(i)],
      });
      tickets.push(Number(tokenId));
    }

    return tickets;
  } catch {
    return [];
  }
}

export async function getListing(tokenId: number): Promise<Listing | null> {
  try {
    const listing = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.marketplace as `0x${string}`,
      abi: MARKETPLACE_ABI,
      functionName: 'listings',
      args: [BigInt(tokenId)],
    });

    return {
      seller: listing[0],
      tokenId: Number(listing[1]),
      price: listing[2].toString(),
      eventId: Number(listing[3]),
      listingTime: Number(listing[4]),
      active: listing[5],
    };
  } catch {
    return null;
  }
}

export async function getTicketURI(tokenId: number): Promise<string> {
  try {
    const uri = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.ticket as `0x${string}`,
      abi: TICKET_ABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });
    return uri;
  } catch {
    return '';
  }
}

export { publicClient };
