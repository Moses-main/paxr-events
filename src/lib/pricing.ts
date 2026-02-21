const ETH_USD_FALLBACK = 2500;

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url);
    if (response.ok) return response;
    if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
  }
  throw new Error(`Failed after ${retries} attempts`);
}

export async function getETHUSDPrice(): Promise<number> {
  try {
    const urls = [
      '/api/coingecko/simple/price?ids=ethereum&vs_currencies=usd',
      'https://api.coinbase.com/v2/prices/ETH-USD/spot',
    ];
    
    let lastError: Error | null = null;
    for (const url of urls) {
      try {
        const response = await fetchWithRetry(url);
        
        if (url.includes('coingecko')) {
          const data = await response.json();
          return data.ethereum?.usd || ETH_USD_FALLBACK;
        } else if (url.includes('coinbase')) {
          const data = await response.json();
          return parseFloat(data.data?.amount) || ETH_USD_FALLBACK;
        }
      } catch (e) {
        lastError = e as Error;
        continue;
      }
    }
    
    console.error('Price fetch error:', lastError);
    return ETH_USD_FALLBACK;
  } catch (error) {
    console.error('Price fetch error:', error);
    return ETH_USD_FALLBACK;
  }
}

export async function getPrices() {
  const ethUsd = await getETHUSDPrice();
  return {
    ETH: ethUsd,
    USDC: 1,
  };
}

export async function formatPriceUSD(priceWei: string, priceUSD?: number): Promise<string> {
  const eth = Number(BigInt(priceWei)) / 1e18;
  const usd = eth * (priceUSD || ETH_USD_FALLBACK);
  return `$${usd.toFixed(2)}`;
}

export function formatETH(priceWei: string): string {
  const eth = Number(BigInt(priceWei)) / 1e18;
  return `${eth.toFixed(4)} ETH`;
}

export function formatUSD(price: number): string {
  return `$${price.toFixed(2)}`;
}
