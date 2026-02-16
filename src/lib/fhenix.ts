import { providers, Signer } from 'ethers';

type JsonRpcProvider = providers.JsonRpcProvider;

let fhenixProvider: JsonRpcProvider | null = null;
let fhenixSigner: Signer | null = null;
let isInitialized = false;

export interface FhenixConfig {
  provider: JsonRpcProvider;
  signer: Signer;
}

export async function initFhenix(config: FhenixConfig): Promise<boolean> {
  try {
    fhenixProvider = config.provider;
    fhenixSigner = config.signer;
    isInitialized = true;
    console.log('Fhenix initialized (mock for Paxr on Arbitrum)');
    return true;
  } catch (error) {
    console.error('Failed to initialize Fhenix:', error);
    return false;
  }
}

export async function createFhenixPermit(): Promise<{ signature: string; address: string } | null> {
  if (!isInitialized || !fhenixSigner) {
    console.warn('Fhenix not initialized');
    return null;
  }

  try {
    const address = await fhenixSigner.getAddress();
    const message = `Paxr permit for ${address}`;
    const signature = await fhenixSigner.signMessage(message);
    return { signature, address };
  } catch (error) {
    console.error('Failed to create Fhenix permit:', error);
    return null;
  }
}

export function isFhenixReady(): boolean {
  return isInitialized;
}

export function getFhenixAddress(): string | null {
  return fhenixSigner ? '' : null;
}

export interface EncryptedData {
  data: string;
  proof: string;
}

export async function encryptRSVPData(eventId: number): Promise<EncryptedData> {
  if (!isInitialized) {
    throw new Error('Fhenix not initialized');
  }
  
  const message = `RSVP event ${eventId}`;
  const signature = await fhenixSigner!.signMessage(message);
  
  return {
    data: eventId.toString(),
    proof: signature,
  };
}

export async function encryptAttendanceProof(ticketId: number): Promise<EncryptedData> {
  if (!isInitialized) {
    throw new Error('Fhenix not initialized');
  }
  
  const message = `Attendance proof for ticket ${ticketId}`;
  const signature = await fhenixSigner!.signMessage(message);
  
  return {
    data: ticketId.toString(),
    proof: signature,
  };
}

export async function encryptResaleData(
  ticketId: number,
  price: bigint,
  sellerAddress: string
): Promise<{ data: string; proof: string }> {
  if (!isInitialized) {
    throw new Error('Fhenix not initialized');
  }
  
  const message = `List ticket ${ticketId} for ${price} by ${sellerAddress}`;
  const signature = await fhenixSigner!.signMessage(message);
  
  return {
    data: JSON.stringify({ ticketId, price: price.toString(), seller: sellerAddress }),
    proof: signature,
  };
}

export interface PrivacySettings {
  hideBuyerIdentity: boolean;
  hideSellerIdentity: boolean;
  encryptAttendance: boolean;
  anonymousRSVP: boolean;
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  hideBuyerIdentity: true,
  hideSellerIdentity: true,
  encryptAttendance: true,
  anonymousRSVP: true,
};
