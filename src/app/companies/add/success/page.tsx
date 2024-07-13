'use client'
import CandidateSignUpForm from '@/components/forms/CandidateSignUpForm';
import clsx from 'clsx';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { useState } from "react";
import CompanySignUpForm from '@/components/forms/CompanySignUpForm';
import NavBar from '@/components/navigation/NavBar';

export default function Home() {
  const [formType, setFormType] = useState<'candidate' | 'company' | null>(null);

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
