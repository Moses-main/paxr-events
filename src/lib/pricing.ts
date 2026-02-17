const ETH_USD_FALLBACK = 2500;

export async function getETHUSDPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await response.json();
    return data.ethereum?.usd || ETH_USD_FALLBACK;
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
