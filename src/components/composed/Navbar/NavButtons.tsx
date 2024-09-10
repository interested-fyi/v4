import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
export function NavButtons() {
  return (
    <div className='flex md:flex-row flex-row gap-4 '>
      <div className='flex gap-4'>
        <Link href={"https://warpcast.com/interestedfyi"} target='_blank'>
          <Button className='w-20 text-xs md:text-sm' variant={"secondary"}>
            Farcaster
          </Button>
        </Link>
      </div>
      <div className='flex gap-4'>
        <Link href={"https://t.me/interestedfyi"} target='_blank'>
          <Button className='w-20 text-xs md:text-sm' variant={"secondary"}>
            Telegram
          </Button>
        </Link>
        <Link href={"https://t.me/chipagosfinest"} target='_blank'>
          <Button className='w-20 text-xs md:text-sm' variant={"secondary"}>
            Help
          </Button>
        </Link>
      </div>
    </div>
  );
}
