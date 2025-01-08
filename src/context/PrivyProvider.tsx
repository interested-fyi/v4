"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { optimism, optimismSepolia } from "viem/chains";
import React, { useEffect, useState } from "react";

const PrivyProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId=''
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets", // defaults to 'off'
        },
        loginMethods: ["google"],
        defaultChain:
          process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
            ? optimismSepolia
            : optimism,
      }}
    >
      <SmartWalletsProvider>{children}</SmartWalletsProvider>
    </PrivyProvider>
  );
};

export default PrivyProviderWrapper;
