import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function ProfileSkeleton() {
  return (
    <div className='w-full flex flex-col items-center justify-start min-h-screen bg-[#2640eb] text-white p-4 md:p-8'>
      {/* Outer container with the background header */}
      <div className='relative w-full min-w-6xl mt-6 md:mt-0 rounded-lg  bg-[#2640eb]'>
        {/* Profile container */}
        <div className='min-h-screen bg-[#2640eb] flex items-start justify-center p-0 mt-16 md:mt-0'>
          <div className='flex md:flex-row flex-col bg-[#e1effe]  shadow-lg w-full max-w-5xl p-6 relative'>
            <div className='flex md:flex-row flex-col items-center md:items-start justify-center w-full'>
              {/* Profile image skeleton */}
              <div className='flex flex-col items-center justify-center'>
                <div className='md:relative md:-top-0 md:left-16 md:-tranlate-x-0 absolute -top-20 left-1/2 transform -translate-x-1/2 border-white border-4 rounded-full'>
                  <Skeleton className='w-32 h-32 rounded-full' />
                </div>

                <div className='mt-20 md:mt-4 text-center'>
                  {/* Name skeleton */}
                  <Skeleton className='h-8 w-48 mx-auto mb-2' />
                  <Skeleton className='h-4 w-64 mx-auto mb-2' />
                  <Skeleton className='h-4 w-80 mx-auto mb-6' />

                  {/* Button skeleton */}
                  <Button
                    variant='outline'
                    className='w-full max-w-xs mb-4'
                    disabled
                  >
                    <Skeleton className='h-4 w-16' />
                  </Button>

                  {/* Social icons skeleton */}
                  <div className='flex max-w-80 mx-auto justify-start space-x-4 mb-8'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='w-8 h-8 rounded' />
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-center justify-center w-full px-2 py-4'>
                {/* Section title skeleton */}
                <Skeleton className='h-6 w-32 mx-auto mb-4' />

                {/* Endorsements skeleton */}
                {[1, 2, 3].map((endorsement) => (
                  <div
                    key={endorsement}
                    className='w-full bg-gray-50 rounded-lg p-4 mb-4'
                  >
                    <div className='flex items-center mb-2'>
                      <Skeleton className='w-12 h-12 rounded-full mr-4' />
                      <div>
                        <Skeleton className='h-4 w-24 mb-2' />
                        <Skeleton className='h-3 w-32' />
                      </div>
                    </div>
                    <Skeleton className='h-4 w-full mb-2' />
                    <Skeleton className='h-4 w-full' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
