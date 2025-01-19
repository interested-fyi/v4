"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export function Footer() {
  return (
    <footer className='w-full py-6 bg-[#4052F6] text-white'>
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
        <div className='flex items-center mx-auto justify-around max-w-48 mt-4 text-xs w'>
          <Link href={"https://t.me/interestedfyi"} target='_blank'>
            <Button className='w-10 h-8 p-0 text-xs md:text-sm bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4]'>
              <Image
                width={4}
                height={4}
                className='w-4 h-4'
                src='/svg/telegram.svg'
                alt='Telegram'
              />
            </Button>
          </Link>
          <Link href={"https://warpcast.com/interestedfyi"} target='_blank'>
            <Button className='w-10 h-8 p-0 text-xs md:text-sm bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4]'>
              <Image
                width={4}
                height={4}
                className='w-4 h-4'
                src='/svg/warpcast.svg'
                alt='Warpcast'
              />
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
