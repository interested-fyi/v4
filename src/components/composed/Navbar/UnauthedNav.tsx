"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
interface UnauthedNavProps {
  login: () => void;
}

const UnauthedNav = ({ login }: UnauthedNavProps) => {
  const pathname = usePathname();

  return (
    <>
      <Link href={"/explore"}>
        <Button variant={"secondary"}>Explore Jobs</Button>
      </Link>
      {pathname.includes("/admin") && (
        <Button variant={"secondary"} onClick={login}>
          Login
        </Button>
      )}
    </>
  );
};
export default UnauthedNav;
