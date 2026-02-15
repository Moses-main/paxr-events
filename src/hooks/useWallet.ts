import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useDisconnect } from 'wagmi';
import { toast } from 'sonner';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isReady: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  linkedAccounts: { address: string; type: string; walletClientType: string }[];
  switchAccount: (address: string, walletClientType: string) => Promise<void>;
}

export function useWallet(): WalletState {
  const { login, logout, user } = usePrivy();
  const { address, chainId, isConnected: wagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const connectWallet = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = async () => {
    try {
      await logout();
      wagmiDisconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const switchNetwork = async (targetChainId: number) => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Failed to switch network');
    }
  };

  const switchAccount = async (targetAddress: string) => {
    try {
      await logout();
      wagmiDisconnect();
      setTimeout(async () => {
        await login();
        toast.success('Switched account');
      }, 100);
    } catch (error) {
      console.error('Failed to switch account:', error);
      toast.error('Failed to switch account');
    }
  };

  const privyAddress = user?.wallet?.address;
  const walletAddress = privyAddress || address || null;
  const isConnected = !!(privyAddress || wagmiConnected);

  const linkedAccounts: { address: string; type: string; walletClientType: string }[] = [];
  if (user?.linkedAccounts) {
    for (const account of user.linkedAccounts) {
      if (account.type === 'wallet' && 'address' in account) {
        linkedAccounts.push({
          address: account.address,
          type: account.walletClientType || 'wallet',
          walletClientType: account.walletClientType || 'wallet',
        });
      }
    }
  }

  return {
    isConnected,
    address: walletAddress,
    chainId: chainId || null,
    isReady,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    linkedAccounts,
    switchAccount,
  };
}
