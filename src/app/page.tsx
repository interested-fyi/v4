'use client'
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';
import CandidateSignUpForm from '@/components/forms/CandidateSignUpForm';
import clsx from 'clsx';
import { PrivyProvider } from '@privy-io/react-auth';
import Image from "next/image";
import { useState } from "react";
import CompanySignUpForm from '@/components/forms/CompanySignUpForm';

export default function Home() {
  const [formType, setFormType] = useState<'candidate' | 'company' | null>(null);

  return (
    <PrivyProvider 
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}>
      <main className="flex min-h-screen flex-col gap-8 items-center justify-start p-24"> 
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/Interested-logo.png"
            alt="Interested Logo"
            width={240}
            height={50}
            priority
          />
        </div>
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
