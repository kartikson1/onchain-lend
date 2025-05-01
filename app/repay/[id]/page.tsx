'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';

// This is a placeholder for the repay functionality
// You would need to implement the actual repayment logic using Morpho

export default function RepayPage() {
  const { id } = useParams();
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading position data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-background dark:text-white bg-white text-black">
        <header className="p-4 border-b dark:border-gray-700">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Onchain Lend
            </Link>
          </div>
        </header>
        
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <p className="mb-4">Please connect your wallet to repay your loan</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-background dark:text-white bg-white text-black">
      <header className="p-4 border-b dark:border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Onchain Lend
          </Link>
          <Link href="/" className="text-sm px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
            Back to Dashboard
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="container mx-auto max-w-md">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Repay Loan</h2>
            
            {isLoading ? (
              <div className="animate-pulse p-4 text-center">Loading position data...</div>
            ) : (
              <div className="text-center">
                <p className="mb-4">Loan ID: {id}</p>
                <p className="mb-6">This page would include a form to repay your loan.</p>
                <p className="text-sm text-gray-500 mb-4">
                  Your teammates are working on this part!
                </p>
                <Link 
                  href="/"
                  className="block w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                >
                  Return to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="p-4 text-center text-sm text-gray-500">
        <p>Powered by Morpho</p>
      </footer>
    </div>
  );
} 