"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { NavButtons } from "./NavButtons";
interface UnauthedNavProps {
  login: () => void;
}

const UnauthedNav = ({ login }: UnauthedNavProps) => {
  const pathname = usePathname();

  return (
    <>
      <NavButtons />
      {pathname.includes("/admin") && (
        <Button variant={"secondary"} onClick={login}>
          Login
        </Button>
      )}
    </>
  );
};
export default UnauthedNav;
