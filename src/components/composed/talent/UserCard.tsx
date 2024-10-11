import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCombinedProfile } from "@/types/return_types";
import Image from "next/image";

export function UserCard({ user }: { user: UserCombinedProfile }) {
  return (
    <Card className='w-full max-w-full mx-auto overflow-hidden bg-white rounded-lg shadow border border-[#c3ddfd]'>
      <CardContent className='p-5 flex flex-col items-center text-center gap-3'>
        <Avatar className='w-16 h-16'>
          <AvatarImage
            src={
              user.photo_source ?? user.preferred_photo ?? "/placeholder.svg"
            }
            alt='Profile picture'
          />
          <AvatarFallback>
            {user.name?.slice(0, 2) ?? user.email?.slice(0, 2) ?? "FYI"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className='text-center text-black text-base font-semibold font-body leading-normal'>
            {user.name || "John Sample"}
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
