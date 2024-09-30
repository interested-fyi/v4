import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function UserCard() {
  return (
    <Card className='w-full max-w-[164px] mx-auto overflow-hidden bg-white rounded-lg shadow border border-[#c3ddfd]'>
      <CardContent className='p-5 flex flex-col items-center text-center gap-3'>
        <div className='w-16 h-16 rounded-full overflow-hidden'>
          <img
            alt='Profile picture'
            className='object-cover w-full h-full'
            height='64'
            src='/placeholder.svg?height=64&width=64'
            style={{
              aspectRatio: "64/64",
              objectFit: "cover",
            }}
            width='64'
          />
        </div>
        <div>
          <h2 className='text-center text-black text-base font-semibold font-body leading-normal'>
            John Sample
          </h2>
          <p className='text-center text-gray-500 text-xs font-medium font-body leading-[18px]'>
            Frontend developer
          </p>
        </div>
        <div className='h-[22px] min-w-[132px] px-2.5 py-0.5 bg-gray-100 rounded-md justify-center items-center gap-1 inline-flex'>
          <Image
            alt='sparkles'
            src='/svg/sparkles.svg'
            width={14}
            height={14}
            className='w-3.5 h-3.5 relative'
          />
          <span className='text-center text-[#111928] text-xs font-medium font-body leading-[18px]'>
            3 endorsements
          </span>
        </div>
        <Button
          className='w-full text-gray-700 text-xs font-medium font-body leading-[18px] rounded-lg border border-gray-700 justify-center items-center'
          variant='outline'
        >
          Unlock calendar
        </Button>
      </CardContent>
    </Card>
  );
}
