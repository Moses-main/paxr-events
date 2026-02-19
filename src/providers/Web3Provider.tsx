import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

const config = createConfig({
  chains: [mainnet, arbitrum, arbitrumSepolia],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc'),
  },
});

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId={import.meta.env.VITE_PRIVY_APP_ID || 'your-privy-app-id'}
          config={{
            appearance: {
              theme: 'light',
              accentColor: '#B87333',
              logo: '/favicon.ico',
            },
            embeddedWallets: {
              createOnLogin: 'all-users',
              noPromptOnSignature: false,
            },
            loginMethods: ['email', 'wallet'],
          }}
        >
          {children}
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
