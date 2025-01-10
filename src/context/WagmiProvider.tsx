"use client";
import React from "react";
import { type State, WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";
import { type PropsWithChildren } from "react";
import { coinbaseWallet, injected, metaMask, safe } from "wagmi/connectors";

interface Props extends PropsWithChildren {
  initialState?: State;
}

export function Web3Provider({ initialState, children }: Props) {
  const config = createConfig({
    chains: [mainnet, optimism],
    connectors: [
      coinbaseWallet({ appName: "Interested.FYI" }),
      injected(),
      safe(),
    ],
    ssr: true,
    transports: {
      [optimism.id]: http(),
      [mainnet.id]: http(),
    },
  });

  return (
    <WagmiProvider initialState={initialState} config={config}>
      {children}
    </WagmiProvider>
  );
}
