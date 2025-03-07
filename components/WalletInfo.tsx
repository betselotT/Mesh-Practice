"use client";

import { useWallet, useLovelace } from "@meshsdk/react";
import { BrowserWallet } from "@meshsdk/core";
import { useEffect, useState } from "react";

export default function WalletInfo() {
  const { connected, wallet, connect, disconnect } = useWallet();
  const lovelace = useLovelace();
  const [address, setAddress] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);

  useEffect(() => {
    if (connected && wallet) {
      wallet.getUsedAddresses().then((addresses) => {
        setAddress(addresses.length > 0 ? addresses[0] : "No address found");
      });
    }
  }, [connected, wallet]);

  useEffect(() => {
    // Fetch available wallets
    const wallets = BrowserWallet.getInstalledWallets().map(
      (wallet) => wallet.name
    );
    setAvailableWallets(wallets);
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-96">
      <h2 className="text-lg font-semibold">Wallet Info</h2>

      {connected ? (
        <>
          <p className="mt-2 text-sm">
            <strong>Address:</strong> {address || "Fetching..."}
          </p>
          <p className="mt-1 text-sm">
            <strong>Lovelace:</strong>{" "}
            {lovelace !== undefined ? lovelace : "Fetching..."}
          </p>
          <button
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          {availableWallets.length > 0 ? (
            availableWallets.map((walletName) => (
              <button
                key={walletName}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 block w-full"
                onClick={() => connect(walletName)}
              >
                Connect {walletName}
              </button>
            ))
          ) : (
            <p className="mt-3 text-red-500">No wallets available</p>
          )}
        </>
      )}
    </div>
  );
}