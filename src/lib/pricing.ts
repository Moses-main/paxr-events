const CHAINLINK_ETH_USD_FEED = '0x639Fe6AB55C921f74e7fac1ee960C0B6293BA61';

async function fetchChainlinkPrice(): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.chainlink.io/api/v1/feeds/arbitrum:${CHAINLINK_ETH_USD_FEED}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }
    
    const data = await response.json();
    return data.data[0]?.price?.round?.value ? Number(data.data[0].price.round.value) / 1e8 : null;
  } catch (error) {
    console.error('Chainlink API error:', error);
    return null;
  }
}

export async function getETHUSDPrice(): Promise<number> {
  const price = await fetchChainlinkPrice();
  if (price !== null) {
    return price;
  }
  
  try {
    const response = await fetch(
      `https://arb-sepolia.g.alchemy.com/v2/demo?contractAddress=${CHAINLINK_ETH_USD_FEED}&methodName=latestAnswer&format=hex`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    const data = await response.json();
    if (data.result) {
      return Number(parseInt(data.result, 16)) / 1e8;
    }
  } catch (error) {
    console.error('Alchemy fallback error:', error);
  }
  
  return 2500;
}

export async function getUSDCUSDPrice(): Promise<number> {
  return 1;
}

export async function getPrices() {
  const [ethUsd] = await Promise.all([getETHUSDPrice()]);

  return {
    ETH: ethUsd,
    USDC: 1,
  };
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
