import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSetActiveWallet } from '@privy-io/wagmi';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
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
  switchAccount: (address: string) => Promise<void>;
}

const SUPPORTED_CHAINS = [
  { id: 421614, name: 'Arbitrum Sepolia' },
  { id: 42161, name: 'Arbitrum One' },
];

export function useWallet(): WalletState {
  const { login, logout, user, ready: privyReady } = usePrivy();
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();
  const { address, chainId, isConnected: wagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (privyReady) {
      setIsReady(true);
    }
  }, [privyReady]);

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
      switchChain({ chainId: targetChainId });
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Failed to switch network');
    }
  };

  const switchAccount = async (address: string) => {
    try {
      const wallet = wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
      if (wallet) {
        await setActiveWallet(wallet);
      }
    } catch (error) {
      console.error('Failed to switch account:', error);
      toast.error('Failed to switch account');
    }
  };

  const privyAddress = user?.wallet?.address;
  const walletAddress = privyAddress || address || null;
  const isConnected = !!(privyAddress || (wagmiConnected && address));

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
    chainId: chainId ? Number(chainId) : null,
    isReady,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    linkedAccounts,
    switchAccount,
  };
}

export { SUPPORTED_CHAINS };
