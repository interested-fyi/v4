import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export default function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className=' bg-yellow-100 text-center py-4 px-4 z-50 shadow-md w-full'>
      <div className='w-full max-w-5xl mx-auto flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Image
            src='/companyLogos/OP-Logo-Red-50.svg'
            alt='Optimism Logo'
            width={40}
            height={40}
            className='w-10 h-10'
          />
          <p className='text-md md:text-lg font-semibold text-gray-800 px-4'>
            Thank you to <span className='text-red-500'>Optimism</span> for{" "}
            <a
              href='https://app.charmverse.io/op-grants/interested-fyi-building-new-social-graphs-on-farcaster-4293677372148865'
              target='_blank'
              rel='noopener noreferrer'
              className='underline hover:text-blue-600 transition-colors'
            >
              providing a grant
            </a>{" "}
            to build this project!
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className='text-gray-600 hover:text-gray-800 transition-colors'
          aria-label='Close banner'
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
