import { Button } from "@/components/ui/button";
import { User } from "@privy-io/react-auth";
import React from "react";
interface UnauthedNavProps {
  login: () => void;
}

const UnauthedNav = ({ login }: UnauthedNavProps) => {
  return (
    <>
      <Button variant={"secondary"}>Explore Jobs</Button>
      <Button variant={"secondary"} onClick={login}>
        Login
      </Button>
    </>
  );
};
export default UnauthedNav;
