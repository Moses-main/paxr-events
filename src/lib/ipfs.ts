import { toast } from 'sonner';

const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';
const IPFS_API = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

export interface EventMetadata {
  name: string;
  description: string;
  image: string;
  location: string;
  eventDate: string;
  ticketPrice: string;
  ticketPriceUSD: string;
  totalTickets: number;
  organizer: string;
  external_url?: string;
}

export async function uploadToIPFS(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(IPFS_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_IPFS_JWT || ''}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to IPFS');
    }

    const data = await response.json();
    return `${IPFS_GATEWAY}${data.IpfsHash}`;
  } catch (error) {
    console.error('IPFS upload error:', error);
    toast.error('Failed to upload image to IPFS');
    return null;
  }
}

export async function uploadEventMetadata(metadata: EventMetadata): Promise<string | null> {
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_IPFS_JWT || ''}`,
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    const data = await response.json();
    return `${IPFS_GATEWAY}${data.IpfsHash}`;
  } catch (error) {
    console.error('IPFS metadata upload error:', error);
    toast.error('Failed to upload event metadata to IPFS');
    return null;
  }
}

export async function uploadImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'event-image.jpg', { type: blob.type });
    return await uploadToIPFS(file);
  } catch (error) {
    console.error('Image URL upload error:', error);
    return imageUrl;
  }
}

export function getIPFSUrl(cid: string): string {
  if (cid.startsWith('http')) {
    return cid;
  }
  return `${IPFS_GATEWAY}${cid}`;
}

export async function fetchMetadata<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return null;
  }
}
