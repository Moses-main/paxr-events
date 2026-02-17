import { TOKENS } from '@/config/contracts';

const ETH_USD_PRICE = 2500;

export function formatPrice(priceWei: string, tokenAddress?: string): string {
  const price = BigInt(priceWei);
  const token = Object.values(TOKENS).find(t => t.address.toLowerCase() === tokenAddress?.toLowerCase()) || TOKENS.ETH;
  
  if (token.symbol === 'USDC') {
    const usdcPrice = price / BigInt(10 ** (18 - token.decimals));
    return `$${Number(usdcPrice).toLocaleString()}`;
  }
  
  const ethPrice = Number(price) / 1e18;
  const usdValue = ethPrice * ETH_USD_PRICE;
  return `$${usdValue.toFixed(2)}`;
}

export function formatETH(priceWei: string): string {
  const eth = Number(BigInt(priceWei)) / 1e18;
  return `${eth.toFixed(4)} ETH`;
}

export function parsePrice(priceUSD: string, tokenAddress?: string): bigint {
  const price = parseFloat(priceUSD);
  const token = Object.values(TOKENS).find(t => t.address.toLowerCase() === tokenAddress?.toLowerCase()) || TOKENS.ETH;
  
  if (token.symbol === 'USDC') {
    return BigInt(Math.round(price * 10 ** token.decimals)) * BigInt(10 ** (18 - token.decimals));
  }
  
  const ethAmount = price / ETH_USD_PRICE;
  return BigInt(Math.round(ethAmount * 1e18));
}

export const PRICE_CONVERSION = {
  ETH_TO_USD: ETH_USD_PRICE,
};
