'use client'

import { PrivyProvider } from '@privy-io/react-auth';
import { useState } from "react";
import NavBar from '@/components/navigation/NavBar';

export default function Home() {

  return (
    <PrivyProvider 
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}>
      <main className="flex min-h-screen flex-col gap-8 items-center justify-start pt-4 pb-24"> 
        <NavBar />
        <p>Thank you for adding your company!</p>
        <p>We will let you know when your job postings are live!</p>
      </main>
    </PrivyProvider>
  );
}
