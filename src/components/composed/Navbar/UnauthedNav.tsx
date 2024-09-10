"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { NavButtons } from "./NavButtons";

interface UnauthedNavProps {
  login: () => void;
}

const UnauthedNav = ({ login }: UnauthedNavProps) => {
  return (
    <div className='flex gap-4'>
      <Button variant={"secondary"} onClick={login}>
        Login
      </Button>
      <NavButtons />
    </div>
  );
};
export default UnauthedNav;
