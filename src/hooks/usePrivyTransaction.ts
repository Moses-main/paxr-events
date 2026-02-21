import { useCallback, useState } from 'react';
import { usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth';
import { encodeFunctionData, parseEther, createWalletClient, custom, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { toast } from 'sonner';

const TARGET_CHAIN_ID = 421614; // Arbitrum Sepolia

export function usePrivyTransaction() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { sendTransaction: privySendTransaction } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false);

  const address = user?.wallet?.address;

  const ensureCorrectChain = useCallback(async () => {
    const wallet = wallets[0];
    if (!wallet) {
      toast.error('No wallet connected');
      return false;
    }

    const currentChainId = Number(wallet.chainId);
    if (currentChainId !== TARGET_CHAIN_ID) {
      console.log('Switching to correct chain. Current:', currentChainId, 'Target:', TARGET_CHAIN_ID);
      try {
        await wallet.switchChain(TARGET_CHAIN_ID);
        await new Promise(r => setTimeout(r, 1500));
      } catch (err) {
        console.error('Failed to switch chain:', err);
        toast.error('Please switch to Arbitrum Sepolia network');
        return false;
      }
    }
    return true;
  }, [wallets]);

  const sendTransaction = useCallback(async (params: {
    to: string;
    data?: string;
    value?: bigint;
  }): Promise<string | null> => {
    const wallet = wallets[0];
    if (!wallet) {
      toast.error('No wallet connected');
      return null;
    }

    try {
      const provider = await wallet.getEthereumProvider();
      
      const walletClient = createWalletClient({
        chain: arbitrumSepolia,
        transport: custom(provider),
      });

      const tx = await walletClient.sendTransaction({
        to: params.to as `0x${string}`,
        data: params.data as `0x${string}` | undefined,
        value: params.value,
        account: wallet.address as `0x${string}`,
      });

      return tx;
    } catch (error: any) {
      console.error('Transaction failed:', error);
      const errorMsg = error?.shortMessage || error?.message || 'Transaction failed';
      toast.error(errorMsg);
      return null;
    }
  }, [wallets]);

  const writeContract = useCallback(async (
    abi: readonly any[],
    functionName: string,
    args: any[],
    value?: string,
    toAddress?: string
  ): Promise<string | null> => {
    const isConnected = !!address || wallets.length > 0;
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return null;
    }

    const wallet = wallets[0];
    if (!wallet) {
      toast.error('No wallet connected');
      return null;
    }

    setIsLoading(true);
    try {
      const chainOk = await ensureCorrectChain();
      if (!chainOk) {
        setIsLoading(false);
        return null;
      }

      const targetAddress = toAddress || CONTRACT_ADDRESSES.event;

      const data = encodeFunctionData({
        abi,
        functionName,
        args,
      });

      console.log('Sending transaction:', {
        to: targetAddress,
        functionName,
        args,
        value: value ? parseEther(value) : undefined,
      });

      const tx = await sendTransaction({
        to: targetAddress,
        data,
        value: value ? parseEther(value) : undefined,
      });

      if (tx) {
        toast.success('Transaction sent! Waiting for confirmation...');
        return tx;
      }
      
      toast.error('Transaction failed');
      return null;
    } catch (error: any) {
      console.error('Transaction failed:', error);
      const errorMsg = error?.shortMessage || error?.message || 'Transaction failed';
      toast.error(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, wallets, ensureCorrectChain, sendTransaction]);

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
      { name: '_ticketPriceUSD', type: 'uint256' },
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
  {
    name: 'transferFrom',
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
