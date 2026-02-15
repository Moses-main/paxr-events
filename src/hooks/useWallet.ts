import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useConnect, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isReady: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
}

export function useWallet(): WalletState {
  const { login, logout, user, isAuthenticated } = usePrivy();
  const { wallets } = useWallets();
  const { address, chainId, isConnected: wagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { connect } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const connectWallet = async () => {
    try {
      if (!isAuthenticated) {
        await login();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (isAuthenticated) {
        await logout();
      }
      wagmiDisconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const switchNetwork = async (targetChainId: number) => {
    try {
      await switchChainAsync({ chainId: targetChainId });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const primaryWallet = wallets.find(w => w.walletClientType === 'privy') || wallets[0];
  const walletAddress = primaryWallet?.address || address || null;

  return {
    isConnected: isAuthenticated || wagmiConnected,
    address: walletAddress,
    chainId: chainId || null,
    isReady,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
}
