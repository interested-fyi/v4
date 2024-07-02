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
        <div>
            <h1 className="mt-16 text-6xl font-bold">Looking for...</h1>
        </div>
        <div className="flex justify-around gap-8">
          <button
            onClick={() => setFormType('candidate')}
            className={clsx(
              "rounded-lg shadow-lg mt-8 py-8 px-16 flex flex-col items-center justify-center",
              formType === 'company' ? "bg-gray-500" : "bg-[#2640EB]"
            )}>
            <h2 className="text-white text-2xl font-extrabold">A sweet new job</h2>
          </button>
          <button
            onClick={() => setFormType('company')}  
            className={clsx(`rounded-xl shadow-lg border-8`, 
              formType === 'candidate' ? 'border-gray-500' : 'border-[#2640EB]',
              `mt-8 py-8 px-16 flex flex-col items-center justify-center`)}>
            <h2 className={clsx(
              `text-2xl font-extrabold`,
              formType === 'candidate' ? 'text-gray-500' : 'text-[#2640EB]')}>A star new teammate</h2>
          </button>
        </div>
        {
          formType === 'candidate' &&
          <div>
            <CandidateSignUpForm />
          </div>
        }
        {
          formType === 'company' &&
          <div>
            <CompanySignUpForm />
          </div>
        }
      </main>
    </PrivyProvider>
  );
}
