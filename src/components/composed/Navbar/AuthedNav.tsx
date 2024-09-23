import { NavButtons } from "./NavButtons";
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
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface AuthedNavProps {
  user: User | null;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const AuthedNav = ({ user, logout, getAccessToken }: AuthedNavProps) => {
  const { data, error, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(`/api/users/profiles/${user?.id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return (await res.json()) as {
        success: boolean;
        profile: any;
      };
    },
  });
  return (
    <div className='flex gap-4'>
      {/* <Button size={"icon"} variant={"ghost"}>
        <Image src='/bell.png' alt='notifications' width={32} height={32} />
      </Button>
      <Button size={"icon"} variant={"ghost"}>
        <Image src='/view-grid.png' alt='apps' width={32} height={32} />
      </Button> */}
      <NavButtons />
      <AvatarMenu
        avatar={
          <Avatar className='h-8 w-8'>
            <AvatarImage src={data?.profile.photo_source ?? undefined} />
            <AvatarFallback>
              {user?.telegram?.username?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        }
        logout={logout}
      />
    </div>
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
