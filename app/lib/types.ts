// Types for loan positions

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export interface LoanPosition {
  id: string; // Unique identifier for the position
  owner: string; // Wallet address
  collateralToken: Token; // Usually ETH
  collateralAmount: string; // Amount in Wei
  borrowToken: Token; // The borrowed token
  borrowAmount: string; // Amount in smallest unit (e.g., wei, satoshi)
  timestamp: number; // When the position was created
  healthFactor: string; // Current health factor
  liquidationPrice: string; // Price at which position gets liquidated
  isLiquidatable?: boolean; // Whether the position can be liquidated
}

// Response type for Morpho operations
export interface MorphoResponse {
  success: boolean;
  txHash?: string;
  error?: string;
} 