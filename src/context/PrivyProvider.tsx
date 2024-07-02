"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import React from "react";

const PrivyProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}>
      {children}
    </PrivyProvider>
  );
};

export default PrivyProviderWrapper;
