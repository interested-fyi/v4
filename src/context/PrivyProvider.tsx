"use client";
import { PrivyProvider } from "@privy-io/react-auth";
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
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyProviderWrapper;
