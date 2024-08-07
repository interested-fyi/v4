import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AuthedNavProps {
  user: User | null;
  logout: () => void;
}
const AuthedNav = ({ user, logout }: AuthedNavProps) => {
  return (
    <>
      {/* <Button size={"icon"} variant={"ghost"}>
        <Image src='/bell.png' alt='notifications' width={32} height={32} />
      </Button>
      <Button size={"icon"} variant={"ghost"}>
        <Image src='/view-grid.png' alt='apps' width={32} height={32} />
      </Button> */}
      <Link href={"/explore"}>
        <Button variant={"secondary"}>Explore Jobs</Button>
      </Link>
      <AvatarMenu
        avatar={
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user?.telegram?.photoUrl ?? "object-cover"} />
            <AvatarFallback>
              {user?.telegram?.username?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        }
        logout={logout}
      />
    </>
  );
};

export default AuthedNav;
interface AvatarMenuProps {
  avatar: React.ReactNode;
  logout: () => void;
}
export const AvatarMenu = ({ avatar, logout }: AvatarMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{avatar}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant={"ghost"} onClick={logout}>
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
