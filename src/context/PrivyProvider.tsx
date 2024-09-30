"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { optimism, optimismSepolia } from "viem/chains";
import React from "react";

const PrivyProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId=''
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets", // defaults to 'off'
        },
        loginMethods: ['google'],
        defaultChain: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? optimismSepolia : optimism,
      }}
    >
      <SmartWalletsProvider>
      {children}
      </SmartWalletsProvider>
    </PrivyProvider>
  );
};

export default PrivyProviderWrapper;
