"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { NavButtons } from "./NavButtons";
import { usePathname } from "next/navigation";

interface UnauthedNavProps {
  login: () => void;
}

const UnauthedNav = ({ login }: UnauthedNavProps) => {
  const pathName = usePathname();
  return (
    <div className='flex gap-4'>
      {pathName.includes("admin/") ? (
        <Button
          className='w-16 h-8 px-4 text-xs md:text-sm bg-[#919CF459]'
          variant={"secondary"}
          onClick={login}
        >
          Login
        </Button>
      ) : null}
      <NavButtons />
    </div>
  );
};
export default UnauthedNav;
