import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
export function NavButtons() {
  return (
    <div className='flex md:flex-row flex-row gap-4 '>
      <div className='flex gap-4'>
        {" "}
        <Link href={"/explore-talent"}>
          <Button className='w-16 h-8 px-4 text-xs text-black bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4] md:text-sm '>
            Talent
          </Button>
        </Link>
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
      </div>
      <div className='flex gap-4'>
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
        <Link href={"https://t.me/chipagosfinest"} target='_blank'>
          <Button className='w-10 h-8 p-0 text-xs md:text-sm bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4]'>
            <Image
              width={4}
              height={4}
              className='w-4 h-4'
              src='/svg/question-mark-circle.svg'
              alt='Help'
            />
          </Button>
        </Link>
      </div>
    </div>
  );
}
