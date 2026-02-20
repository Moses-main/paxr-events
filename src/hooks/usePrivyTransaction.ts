import { useCallback, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';
import { arbitrumSepolia } from 'wagmi/chains';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { toast } from 'sonner';

interface TransactionRequest {
  to: string;
  data?: string;
  value?: string;
}

export function usePrivyTransaction() {
  const { user, sendTransaction } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);

  const address = user?.wallet?.address;

  const writeContract = useCallback(async (
    abi: readonly any[],
    functionName: string,
    args: any[],
    value?: string
  ): Promise<string | null> => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return null;
    }

    setIsLoading(true);
    try {
      const data = encodeFunctionData({
        abi,
        functionName,
        args,
      });

      const tx: TransactionRequest = {
        to: CONTRACT_ADDRESSES.event,
        data,
      };

      if (value) {
        tx.value = value;
      }

      const receipt = await sendTransaction(tx);
      const txHash = (receipt as any)?.hash || (receipt as any)?.transactionHash;
      toast.success('Transaction sent!');
      return txHash;
    } catch (error: any) {
      console.error('Transaction failed:', error);
      toast.error(error?.message || 'Transaction failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, sendTransaction]);

  const writeContractWithChain = useCallback(async (
    abi: readonly any[],
    functionName: string,
    args: any[],
    chainId: number = 421614,
    value?: string
  ): Promise<string | null> => {
    return writeContract(abi, functionName, args, value);
  }, [writeContract]);

  return {
    writeContract,
    writeContractWithChain,
    isLoading,
    address,
  };
}

export const EVENT_ABI = [
  {
    name: 'createEvent',
    type: 'function',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_description', type: 'string' },
      { name: '_imageURI', type: 'string' },
      { name: '_location', type: 'string' },
      { name: '_ticketPrice', type: 'uint256' },
      { name: '_totalTickets', type: 'uint256' },
      { name: '_eventDate', type: 'uint256' },
      { name: '_saleStartTime', type: 'uint256' },
      { name: '_saleEndTime', type: 'uint256' },
      { name: '_paymentToken', type: 'address' },
      { name: '_resaleEnabled', type: 'bool' },
      { name: '_maxResalePrice', type: 'uint256' },
      { name: '_groupBuyDiscount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'purchaseTicket',
    type: 'function',
    inputs: [
      { name: 'eventId', type: 'uint256' },
      { name: 'quantity', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
] as const;

export const TICKET_ABI = [
  {
    name: 'mintTicket',
    type: 'function',
    inputs: [
      { name: 'eventId', type: 'uint256' },
      { name: 'quantity', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const MARKETPLACE_ABI = [
  {
    name: 'listTicket',
    type: 'function',
    inputs: [
      { name: 'ticketId', type: 'uint256' },
      { name: 'price', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'buyTicket',
    type: 'function',
    inputs: [
      { name: 'listingId', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
] as const;

export { CONTRACT_ADDRESSES };
