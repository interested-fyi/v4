"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className='w-full mt-36 py-6 bg-[#4052F6] text-white'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-center space-x-6 text-sm'>
          <Link
            href='/tos'
            className='hover:underline transition-colors duration-200 ease-in-out'
          >
            Terms of Service
          </Link>
          <Link
            href='/privacy'
            className='hover:underline transition-colors duration-200 ease-in-out'
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
