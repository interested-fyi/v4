import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
interface UnauthedNavProps {
  login: () => void;
}

const UnauthedNav = ({ login }: UnauthedNavProps) => {
  return (
    <>
      <Link href={"/explore"}>
        <Button variant={"secondary"}>Explore Jobs</Button>
      </Link>
      <Button variant={"secondary"} onClick={login}>
        Login
      </Button>
    </>
  );
};
export default UnauthedNav;
