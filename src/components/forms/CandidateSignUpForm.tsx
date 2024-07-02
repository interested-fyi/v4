"use client";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { Button } from "../ui/button";

export default function CandidateSignUpForm() {
  const [acceptDC, setAcceptDC] = useState(false);

  const handleAcceptDC = async () => {
    // TODO - implement functionality to check if user has accepted DCs
    // Need to research
    setAcceptDC(!acceptDC);
  };

  return (
    <div className='flex flex-col justify-center items-center gap-8 bg-[#919CF480] p-8 rounded-xl font-body'>
      <div className='flex flex-col w-full gap-8 justify-start'>
        <div>
          <div className='items-top flex space-x-2 text-white'>
            <Checkbox
              id='acceptCast'
              className='h-6 w-6 border border-white checked:bg-[#8A63D2]'
              checked={acceptDC}
              onClick={() => handleAcceptDC()}
            />
            <div className='grid gap-1.5 leading-none items-center'>
              <label
                htmlFor='acceptCast'
                className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Accept direct casts
              </label>
            </div>
          </div>
        </div>
        {/* Check if user follows interested.fyi and prompt if not */}
        <div className='flex flex-col justify-start min-h-24 gap-4 text-white'>
          {acceptDC ? (
            <>
              <p className='text-lg font-bold'>
                Follow{" "}
                <a
                  className='text-[#E8FC6C]'
                  href='https://warpcast.com/interestedfyi'
                  target='_blank'
                >
                  @interestedfyi
                </a>{" "}
                on Farcaster
              </p>
              <Button
                size='lg'
                className='flex items-center gap-4 shadow-md border bg-[#7c58c1] hover:bg-[#986de8] rounded-xl w-max'
              >
                <Image
                  className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
                  src='/fc-logo-transparent-white.png'
                  alt='Farcaster Logo'
                  width={40}
                  height={50}
                  priority
                />
                <p className='text-xl font-bold text-white'>Follow</p>
              </Button>
            </>
          ) : null}
        </div>
        {acceptDC ? (
          <Button
            size='lg'
            className='rounded-xl py-8 border border-[#E8FC6C] w-[350px] bg-[#2640EB] text-[#E8FC6C] font-bold text-xl shadow-md'
          >
            Create Profile
          </Button>
        ) : null}
      </div>
    </div>
  );
}
