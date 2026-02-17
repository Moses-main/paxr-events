import { useState, useEffect } from 'react';
import { getPrices } from '@/lib/pricing';

interface PriceData {
  ETH: number;
  USDC: number;
  lastUpdated: number;
}

const DEFAULT_PRICES: PriceData = {
  ETH: 2500,
  USDC: 1,
  lastUpdated: 0,
};

export function usePrices() {
  const [prices, setPrices] = useState<PriceData>(DEFAULT_PRICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    const fetchPrices = async () => {
      try {
        const data = await getPrices();
        if (mounted) {
          setPrices({
            ETH: data.ETH,
            USDC: data.USDC,
            lastUpdated: Date.now(),
          });
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to fetch prices');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPrices();

    interval = setInterval(fetchPrices, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { prices, loading, error };
}

export function formatPrice(priceWei: string, priceUSD?: number): string {
  const eth = Number(BigInt(priceWei)) / 1e18;
  const usdValue = eth * (priceUSD || 2500);
  return `$${usdValue.toFixed(2)}`;
}

export function formatETH(priceWei: string): string {
  const eth = Number(BigInt(priceWei)) / 1e18;
  return `${eth.toFixed(4)} ETH`;
}
