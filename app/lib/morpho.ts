// This file will contain functions to interact with Morpho protocol
import { LoanPosition, MorphoResponse, Token } from './types';
import { createPublicClient, http, getContract, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { MarketId } from "@morpho-org/blue-sdk";

import { AccrualPosition } from "@morpho-org/blue-sdk-viem/lib/augment/Position";


// Common tokens
export const TOKENS: { [key: string]: Token } = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Convention for native ETH
    decimals: 18
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18
  },
  USDC: { 
    symbol: 'USDC', 
    name: 'USD Coin', 
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6
  },
  DAI: { 
    symbol: 'DAI', 
    name: 'Dai Stablecoin', 
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18
  },
  WBTC: { 
    symbol: 'WBTC', 
    name: 'Wrapped Bitcoin', 
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    decimals: 8
  },
  wstETH: {
    symbol: 'wstETH',
    name: 'Wrapped stETH',
    address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    decimals: 18
  }
};

// Morpho protocol addresses
export const MORPHO_ADDRESSES = {
  MORPHO_BLUE: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb', // Morpho Blue on Ethereum mainnet
};

// Known Morpho Blue market IDs on mainnet
export const MORPHO_MARKET_IDS = [
  // WETH/WSTETH
  '0x22a23b83be9efc8a5352f4f3e495cf9f8564f96caba658b75890771bf7a01db4',
  // WETH/USDC
  '0xe7e9694b754c4d4f7e21faf7f5a5aa0f5a59a231328aeaa92215ef98fb9cd41d',
  // WETH/DAI 
  '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
  // USDC/WETH
  '0x277d0e1779ef284dba98e82bf8ef6857babe2f58a9885ef51ad8b2c9788f0016',
  // USDC/wBTC
  '0x7dda9ffb416b62d4d688992eb7d56b14209964a477e224dcc2ae3a9b20e76d5b'
];

// Morpho Blue ABI (only the functions we need)
const MORPHO_ABI = [
  'function position(bytes32 marketId, address user) view returns ((uint256 supplyShares, uint256 borrowShares, uint256 collateral))',
  'function market(bytes32 id) view returns ((address loan, address collateral, address oracle, address irm, uint256 lltv), uint128 totalSupplyAssets, uint128 totalSupplyShares, uint128 totalBorrowAssets, uint128 totalBorrowShares, uint128 lastUpdate, uint128 fee)',
  'function idToMarketParams(bytes32 id) view returns (address loan, address collateral, address oracle, address irm, uint256 lltv)',
  'function isLiquidatable(bytes32 marketId, address borrower) view returns (bool)',
  'function healthFactor(bytes32 marketId, address borrower) view returns (uint256)'
];

// Mock function to simulate borrowing from Morpho (to be replaced with actual implementation)
export async function borrowFromMorpho(
  walletAddress: string,
  tokenAddress: string,
  collateralAmount: string,
  borrowAmount: string
): Promise<MorphoResponse> {
  // This is a mock implementation
  // In a real implementation, you would:
  // 1. Use the Morpho SDK or directly interact with smart contracts
  // 2. Send transactions to deposit collateral and borrow assets
  
  console.log('Borrowing from Morpho:', {
    walletAddress,
    tokenAddress,
    collateralAmount,
    borrowAmount,
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock successful transaction
  return {
    success: true,
    txHash: `0x${Math.random().toString(16).slice(2)}`,
  };
}

// Function to calculate health factor based on collateral and borrow amount
export function calculateHealthFactor(
  collateralAmountETH: number,
  borrowAmountInUSD: number,
  ethPriceInUSD: number = 1800 // Default ETH price, ideally would be fetched from an oracle
): number {
  if (borrowAmountInUSD === 0) return Infinity;
  
  const collateralValueInUSD = collateralAmountETH * ethPriceInUSD;
  const liquidationThreshold = 0.75; // 75% (this should be fetched from Morpho)
  
  // Health Factor = (Collateral * Liquidation Threshold) / Total Borrows
  const healthFactor = (collateralValueInUSD * liquidationThreshold) / borrowAmountInUSD;
  
  return healthFactor;
}

// Function to get token info by address
function getTokenByAddress(address: string): Token {
  for (const token of Object.values(TOKENS)) {
    if (token.address.toLowerCase() === address.toLowerCase()) {
      return token;
    }
  }
  // If token not found, return a placeholder token
  return {
    symbol: 'UNKNOWN',
    name: 'Unknown Token',
    address: address,
    decimals: 18
  };
}

// Actual function to get user's open positions
export async function getUserPositions(walletAddress: string): Promise<LoanPosition[]> {
  console.log(`Fetching positions for ${walletAddress}`);
  
  try {
    // Create a viem client
    const client = createPublicClient({
      chain: mainnet,
      transport: http()
    });

    console.log("client", client);
    
    // Get Morpho contract
    const morpho = getContract({
      address: MORPHO_ADDRESSES.MORPHO_BLUE as `0x${string}`,
      abi: MORPHO_ABI,
      client
    });

    console.log("morpho", morpho);
    
    const positions: LoanPosition[] = [];
    
    // Check positions across known markets
    for (const marketId of MORPHO_MARKET_IDS) {
      try {
        // Get user position in this market

        const position = await AccrualPosition.fetch(
          walletAddress as `0x${string}`,
          marketId as MarketId,
          client
        );


        console.log("position", position);

        console.log("Borrow Assets:", position.borrowAssets);
        console.log("Is Healthy:", position.isHealthy);
        console.log("Max Borrowable Assets:", position.maxBorrowableAssets);
      } catch (err) {
        console.error(`Error fetching market ${marketId}:`, err);
        // Continue to next market
      }
    }
    
    return positions;
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw new Error('Failed to fetch positions from Morpho');
  }
} 