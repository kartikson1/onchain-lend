'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getUserPositions } from '../lib/morpho';
import { LoanPosition } from '../lib/types';
import { formatUnits } from 'viem';

export default function PositionsList() {
  const { address, isConnected } = useAccount();
  const [positions, setPositions] = useState<LoanPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!address || !isConnected) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getUserPositions(address);
        setPositions(data);
      } catch (err) {
        console.error('Failed to fetch positions:', err);
        setError('Failed to load your positions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPositions();
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <div className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-background shadow">
        <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
        <p className="text-gray-500 dark:text-gray-400">Connect your wallet to view your positions.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-background shadow">
        <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 rounded-lg border border-red-200 dark:border-red-700 bg-white dark:bg-background shadow">
        <h2 className="text-xl font-semibold mb-4">Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-background shadow">
        <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
        <p className="text-gray-500 dark:text-gray-400">You don't have any open positions on Morpho.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-background shadow">
      <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2 text-left">Market</th>
              <th className="px-4 py-2 text-left">Collateral</th>
              <th className="px-4 py-2 text-left">Borrowed</th>
              <th className="px-4 py-2 text-left">Health</th>
              <th className="px-4 py-2 text-left">Liquidation Price</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr 
                key={position.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {position.borrowToken.symbol}/{position.collateralToken.symbol}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {shortenString(position.id)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>
                      {formatAmount(position.collateralAmount, position.collateralToken.decimals)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {position.collateralToken.symbol}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>
                      {formatAmount(position.borrowAmount, position.borrowToken.decimals)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {position.borrowToken.symbol}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className={`inline-block px-2 py-1 rounded-full ${getHealthColor(parseFloat(position.healthFactor))}`}>
                    {parseFloat(position.healthFactor).toFixed(2)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>${parseFloat(position.liquidationPrice).toFixed(2)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to format amounts with proper decimal display
function formatAmount(amount: string, decimals: number): string {
  try {
    const value = formatUnits(BigInt(amount), decimals);
    return parseFloat(value).toFixed(4);
  } catch (error) {
    console.error('Error formatting amount:', error);
    return '0.0000';
  }
}

// Helper function to shorten strings (addresses, IDs, etc.)
function shortenString(str: string): string {
  if (str.length <= 13) return str;
  return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
}

// Helper function to determine health factor color
function getHealthColor(health: number): string {
  if (health < 1.1) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  if (health < 1.5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
} 