'use client';

import Link from 'next/link';
import BorrowForm from '../components/BorrowForm';

export default function BorrowPage() {
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
        <div className="container mx-auto max-w-4xl">
          <BorrowForm />
        </div>
      </main>
      
      <footer className="p-4 text-center text-sm text-gray-500">
        <p>Powered by Morpho</p>
      </footer>
    </div>
  );
} 