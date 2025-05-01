'use client';

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import ImageSvg from './svg/Image';
import Link from 'next/link';
import LoanPositions from './components/LoanPositions';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <header className="pt-4 px-4 pb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Onchain Lend</h1>
          <div className="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="w-1/4 mx-auto mb-6">
              <ImageSvg />
            </div>
            
            <div className="flex justify-center mb-6">
              <Link href="/borrow" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md">
                + New Borrow Position
              </Link>
            </div>
          </div>
          
          <LoanPositions />
          
          <p className="text-center mt-8 mb-6 text-sm text-gray-500">
            Powered by Morpho Protocol
          </p>
        </div>
      </main>
    </div>
  );
}
