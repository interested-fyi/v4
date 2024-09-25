import { NavButtons } from "./NavButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCombinedProfile } from "@/types/return_types";
import { usePrivy, User } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

interface AuthedNavProps {
  user: User | null;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const AuthedNav = ({ user, logout, getAccessToken }: AuthedNavProps) => {
  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id.replace("did:privy:", "")],
    queryFn: async () => {
      const res = await fetch(
        `/api/users/${user?.id.replace("did:privy:", "")}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
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
            <AvatarImage src={data?.profile?.photo_source ?? undefined} />
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
  const { user } = usePrivy();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{avatar}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className='text-gray-500 text-sm font-medium font-body leading-[21px]'>
          <Link href={`/profile/${user?.id.replace("did:privy:", "")}`}>
            View profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='text-gray-500 text-sm font-medium font-body leading-[21px]'>
          Edit profile
        </DropdownMenuItem>{" "}
        <DropdownMenuItem className='text-gray-500 text-sm font-medium font-body leading-[21px]'>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            variant={"ghost"}
            className='text-[#f05252] text-sm font-medium font-body leading-[21px] pl-0'
            onClick={logout}
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
