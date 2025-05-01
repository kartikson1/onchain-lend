'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { getUserPositions } from '../lib/morpho';
import { LoanPosition } from '../lib/types';
import Link from 'next/link';

export default function LoanPositions() {
  const { address, isConnected } = useAccount();
  const [positions, setPositions] = useState<LoanPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!isConnected || !address) {
        setPositions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userPositions = await getUserPositions(address);
        setPositions(userPositions);
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [address, isConnected]);

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Format amount with correct decimals
  const formatAmount = (amount: string, decimals: number) => {
    return formatUnits(BigInt(amount), decimals);
  };

  // Determine style for health factor
  const getHealthFactorStyle = (healthFactor: string) => {
    const hf = parseFloat(healthFactor);
    if (hf < 1.2) return 'text-red-500';
    if (hf < 1.5) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (loading) {
    return (
      <div className="mt-8 border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Your Open Positions</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-pulse text-gray-500">Loading positions...</div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="mt-8 border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Your Open Positions</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          Connect your wallet to view your positions
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="mt-8 border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Your Open Positions</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          No open positions yet. Create a new borrow position to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold">Your Open Positions</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Collateral
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Borrowed
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Health Factor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {positions.map((position) => (
              <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{formatAmount(position.collateralAmount, position.collateralToken.decimals)} {position.collateralToken.symbol}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{formatAmount(position.borrowAmount, position.borrowToken.decimals)} {position.borrowToken.symbol}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`font-bold ${getHealthFactorStyle(position.healthFactor)}`}>
                    {position.healthFactor}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(position.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    href={`/repay/${position.id}`}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Repay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 