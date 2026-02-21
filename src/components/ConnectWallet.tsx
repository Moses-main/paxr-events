import { useWallet, SUPPORTED_CHAINS } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink, Users, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBalance } from 'wagmi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { usePrices } from '@/hooks/usePrices';

export function ConnectWallet() {
  const { isConnected, address, connectWallet, disconnectWallet, chainId, linkedAccounts, switchAccount, switchNetwork } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const { prices } = usePrices();

  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: !!address,
    }
  });

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = () => {
    if (!balance) return '...';
    return parseFloat(balance.formatted).toFixed(4);
  };

  const formatBalanceInUSD = () => {
    if (!balance) return '...';
    const eth = parseFloat(balance.formatted);
    return `$${(eth * prices.ETH).toFixed(2)}`;
  };

  const getChainName = (id: number | null) => {
    if (!id) return 'Unknown';
    const chain = SUPPORTED_CHAINS.find(c => c.id === id);
    return chain ? chain.name : `Chain ${id}`;
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied');
    }
  };

  const disconnect = async () => {
    await disconnectWallet();
  };

  const handleSwitchAccount = async (accountAddress: string) => {
    await switchAccount(accountAddress);
  };

  const handleSwitchNetwork = async (targetChainId: number) => {
    await switchNetwork(targetChainId);
  };

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="bg-copper-500 hover:bg-copper-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        style={{ backgroundColor: '#B87333' }}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-copper-200 hover:border-copper-400 hover:bg-copper-50 font-medium px-4"
          style={{ borderColor: '#E5C9B8' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>{formatAddress(address || '')}</span>
            <span className="text-xs text-muted-foreground ml-1">
              {formatBalanceInUSD()}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5">
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Network:</span>
              <span className="font-medium text-foreground">{getChainName(chainId)}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Balance:</span>
              <span className="font-medium text-foreground">{formatBalanceInUSD()}</span>
            </div>
          </div>
        </div>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <RefreshCw className="w-4 h-4 mr-2" />
            Switch Network
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {SUPPORTED_CHAINS.map((chain) => (
              <DropdownMenuItem
                key={chain.id}
                onClick={() => handleSwitchNetwork(chain.id)}
                className={`cursor-pointer ${chainId === chain.id ? 'bg-primary/10 font-bold' : ''}`}
              >
                {chain.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        {linkedAccounts.length > 1 && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Users className="w-4 h-4 mr-2" />
                Switch Account
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {linkedAccounts.map((account) => (
                  <DropdownMenuItem
                    key={account.address}
                    onClick={() => handleSwitchAccount(account.address)}
                    className={`cursor-pointer ${account.address === address ? 'bg-primary/10' : ''}`}
                  >
                    <span className={account.address === address ? 'font-bold' : ''}>
                      {formatAddress(account.address)}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground capitalize">
                      {account.type}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={chainId === 421614 ? `https://sepolia.arbiscan.io/address/${address}` : `https://arbiscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on {chainId === 421614 ? 'Arbiscan (Sepolia)' : 'Arbiscan'}
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
