"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SwitchButtonGroup from "@/components/composed/buttons/SwitchButtonGroup";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className='flex flex-col items-center min-h-screen bg-blue-600 text-white p-4 px-0 md:p-8'>
      <div className='w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg'>
        <div className='bg-blue-600 h-20'></div>
        <div className='relative px-4 pb-4 bg-[#e1effe]'>
          <Avatar className='w-24 h-24 border-4 border-white rounded-full absolute -top-12 left-1/2 transform -translate-x-1/2'>
            <AvatarImage
              src='/placeholder.svg?height=96&width=96'
              alt='Profile picture'
            />
            <AvatarFallback>CL</AvatarFallback>
          </Avatar>
          <div className='pt-16 flex flex-col gap-2 text-center max-w-[343px]'>
            <h1 className='text-[#2640eb] text-xl font-semibold font-body leading-[30px]'>
              Chester LaCroix
            </h1>
            <p className='text-gray-700 text-sm font-semibold font-body leading-[21px]'>
              Short bio here? Do we have this in the profile editing flow
              somewhere - yes we do
            </p>
          </div>
          <div className='flex justify-center gap-2 mt-8 max-w-[343px] mx-auto'>
            <Button
              className='flex-1 bg-white border border-black text-gray-700 text-xs font-medium font-body leading-[18px]
            '
            >
              Support builder
              <Image
                className='ml-2'
                src={"/svg/gift.svg"}
                alt='gift'
                height={16}
                width={16}
              />
            </Button>
            <Button
              className='flex-1 bg-white border border-black text-gray-700 text-xs font-medium font-body leading-[18px]
            '
            >
              Endorse
              <Image
                className='ml-2'
                src={"/svg/hand.svg"}
                alt='hand'
                height={16}
                width={16}
              />
            </Button>
          </div>
          <div className='w-full flex justify-center mt-4'>
            <div className='w-[343px] h-[34px] relative'>
              <div className='w-[343px] h-[34px] pl-3 pr-[11px] py-2 left-0 top-0 absolute opacity-40 bg-white rounded-lg border border-gray-700 blur-[3px] justify-center items-center gap-2 inline-flex'>
                <div className='text-gray-700 text-xs font-medium font-body leading-[18px]'>
                  Schedule a call
                </div>
                <div className='w-4 h-4 relative' />
              </div>
              <Button
                variant={"link"}
                className='w-[343px] hover:no-underline bg-transparent absolute text-center text-[#2640eb] text-sm font-semibold font-body leading-[21px]'
              >
                Unlock scheduling for $15
              </Button>
            </div>
          </div>
          <div className='flex justify-center gap-4 mt-8'>
            <Button className='bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4] w-[55px] h-8'>
              <Image
                src='/svg/blue-logos/telegram.svg'
                alt='telegram'
                height={16}
                width={16}
              />
            </Button>
            <Button className='bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4]  w-[55px] h-8'>
              <Image
                src='/svg/blue-logos/farcast.svg'
                alt='farcast'
                height={16}
                width={16}
              />
            </Button>
            <Button className='bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4] w-[55px] h-8'>
              <Image
                src='/svg/blue-logos/github.svg'
                alt='github'
                height={16}
                width={16}
              />
            </Button>
            <Button className='bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4] w-[55px] h-8'>
              <Image
                src='/svg/blue-logos/linkedin.svg'
                alt='linkedin'
                height={16}
                width={16}
              />
            </Button>
            <Button className='bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4] w-[55px] h-8'>
              <Image
                src='/svg/blue-logos/x.svg'
                alt='x'
                height={16}
                width={16}
              />
            </Button>
          </div>
          <div className='mt-8'>
            <SwitchButtonGroup
              buttons={[
                { text: "ACTIVITY", onClick: () => {}, isActive: true },
                { text: "ENDORSEMENTS", onClick: () => {}, isActive: false },
              ]}
              svgOnClick={() => {}}
            />
          </div>
          <h2
            className='
          text-gray-600
text-xl
font-bold
font-body text-center mt-7 mb-6'
          >
            Endorsements
          </h2>
          {[1, 2, 3].map((index) => (
            <Card key={index} className='mb-4 p-4'>
              <div className='flex items-start gap-4'>
                <Avatar>
                  <AvatarImage
                    src='/placeholder.svg?height=40&width=40'
                    alt='Tina Haibodi'
                  />
                  <AvatarFallback>TH</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='font-semibold text-blue-600'>Tina Haibodi</h3>
                  <p className='text-sm text-gray-600'>August 14th, 2023</p>
                  <p className='text-sm font-semibold mt-1'>Friend/Associate</p>
                  <p className='text-sm text-gray-700 mt-2'>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua."
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
