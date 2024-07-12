import { Button } from "@/components/ui/button";
import Image from "next/image";

export function InterestedButton() {
  return (
    <Button className='max-h-11 max-w-full h-full self-stretch pl-[19px] pr-5 py-2.5 bg-blue-700 rounded-lg w-[137px] justify-center items-center gap-2 flex'>
      <Image
        height={20}
        width={20}
        alt='thumb icon'
        className='w-full max-w-[14.09px] h-4'
        src='/whiteThumb.svg'
      />
      <div className='text-sm font-medium font-body leading-[21px]'>
        I&apos;m interested
      </div>
    </Button>
  );
}
