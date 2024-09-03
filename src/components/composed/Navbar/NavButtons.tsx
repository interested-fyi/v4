import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
export function NavButtons() {
  return (
    <>
      <Link href={"/explore"}>
        <Button variant={"secondary"}>Explore Jobs</Button>
      </Link>
      <Link href={"https://warpcast.com/interestedfyi"} target='_blank'>
        <Button variant={"secondary"}>Farcaster</Button>
      </Link>
      <Link href={"https://t.me/interestedfyi"} target='_blank'>
        <Button variant={"secondary"}>Telegram</Button>
      </Link>
      <Link href={"https://t.me/chipagosfinest"} target='_blank'>
        <Button variant={"secondary"}>Help</Button>
      </Link>
    </>
  );
}
