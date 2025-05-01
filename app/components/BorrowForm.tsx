'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { borrowFromMorpho, calculateHealthFactor, TOKENS } from '../lib/morpho';
import { Token } from '../lib/types';

// Use tokens from the shared constants
const SUPPORTED_TOKENS: Token[] = [
  TOKENS.USDC,
  TOKENS.DAI,
  TOKENS.WBTC
];

export default function BorrowForm() {
  const { address, isConnected } = useAccount();
  
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [healthFactor, setHealthFactor] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const updateHealthFactor = (collateral: string, borrow: string) => {
    if (!collateral || !borrow || parseFloat(borrow) === 0) {
      setHealthFactor('0');
      return;
    }
    
    const collateralETH = parseFloat(collateral);
    const borrowUSD = parseFloat(borrow);
    const calculatedHF = calculateHealthFactor(collateralETH, borrowUSD);
    
    setHealthFactor(calculatedHF.toFixed(2));
  };

  const handleCollateralChange = (value: string) => {
    setCollateralAmount(value);
    updateHealthFactor(value, borrowAmount);
  };

  const handleBorrowChange = (value: string) => {
    setBorrowAmount(value);
    updateHealthFactor(collateralAmount, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (parseFloat(healthFactor) < 1.5) {
      alert('Health factor is too low. Increase collateral or decrease borrow amount.');
      return;
    }
    
    setIsSubmitting(true);
    setTxHash(null);
    
    try {
      const result = await borrowFromMorpho(
        address,
        selectedToken.address,
        collateralAmount,
        borrowAmount
      );
      
      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        // Could redirect to positions page or clear form
      }
    } catch (error) {
      console.error('Failed to submit borrow request:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHealthFactorColor = () => {
    const hf = parseFloat(healthFactor);
    if (hf === 0) return 'text-gray-500';
    if (hf < 1.2) return 'text-red-500';
    if (hf < 1.5) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Borrow Against ETH</h2>
      
      {txHash ? (
        <div className="p-4 mb-6 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-green-700 dark:text-green-300 font-medium">Transaction submitted!</p>
          <p className="text-sm text-green-600 dark:text-green-400 break-all mt-1">
            Tx Hash: {txHash}
          </p>
          <button 
            onClick={() => setTxHash(null)}
            className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded"
          >
            Create another position
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Token to Borrow</label>
            <select 
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              value={selectedToken.symbol}
              onChange={(e) => {
                const token = SUPPORTED_TOKENS.find(t => t.symbol === e.target.value);
                if (token) setSelectedToken(token);
              }}
            >
              {SUPPORTED_TOKENS.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">ETH Collateral Amount</label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                value={collateralAmount}
                onChange={(e) => handleCollateralChange(e.target.value)}
                placeholder="0.0"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500">ETH</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Borrow Amount</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                value={borrowAmount}
                onChange={(e) => handleBorrowChange(e.target.value)}
                placeholder="0.0"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500">{selectedToken.symbol}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Health Factor:</span>
              <span className={`font-bold ${getHealthFactorColor()}`}>
                {healthFactor === '0' ? '—' : healthFactor}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Health factor should be above 1.5 to avoid liquidation
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!isConnected || isSubmitting || parseFloat(healthFactor) < 1.5}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Borrow'}
          </button>
        </form>
      )}
    </div>
  );
} 