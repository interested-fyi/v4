"use client";
import { NavButtons } from "./NavButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrivy, User } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ProfileEditForm } from "../profile/ProfileEdit";
import { LoaderIcon } from "lucide-react";
import { UserCombinedProfile } from "@/types/return_types";
import { fetchUserProfile } from "@/lib/api/helpers";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthedNavProps {
  user: User | null;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const AuthedNav = ({ user, logout, getAccessToken }: AuthedNavProps) => {
  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id.replace("did:privy:", "")],
    queryFn: async () => await fetchUserProfile({ userId: user?.id }),
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
            <AvatarImage
              src={
                data?.profile?.photo_source ??
                data?.profile?.preferred_photo ??
                undefined
              }
            />
            <AvatarFallback>{user?.google?.name?.slice(0, 2)}</AvatarFallback>
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
  const [open, setOpen] = useState(false);

  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    bestProfile: "",
  });
  const { user, getAccessToken } = usePrivy();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: userProfileData,
    isLoading: userProfileDataLoading,
    error: userProfileError,
    refetch: refetchUserProfile,
  } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id?.replace("did:privy:", "")],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `/api/users/${user?.id?.replace("did:privy:", "")}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return (await res.json()) as {
        success: boolean;
        profile: UserCombinedProfile;
      };
    },
  });

  const handleSubmitForm = async (form: {
    name: string;
    email: string;
    bio: string;
    bestProfile: string;
  }) => {
    const accessToken = await getAccessToken();
    const formToSubmit = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );
    const res = await fetch(`/api/users/save-user-profile`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: formToSubmit.name,
        photo_source: tempPhotoUrl,
        preferred_profile: formToSubmit.bestProfile,
        bio: formToSubmit.bio,
        privy_did: user?.id,
        smart_wallet_address: user?.smartWallet?.address,
      }),
    });
    const resData = await res.json();

    return resData as {
      success: boolean;
      profile: any;
      schema_success: false;
    };
  };

  useEffect(() => {
    if (searchParams.get("editMode")) {
      setOpen(true);
    }
  }, [searchParams]);

  return (
    <Dialog
      open={open}
      onOpenChange={async (open) => {
        setOpen(open);
        if (!open) {
          router.push(`/profile/${user?.id.replace("did:privy:", "")}`);
          await refetchUserProfile();
        }
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{avatar}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className='text-gray-500 text-sm font-medium font-body leading-[21px]'>
            <Link href={`/profile/${user?.id.replace("did:privy:", "")}`}>
              View profile
            </Link>
          </DropdownMenuItem>
          <DialogTrigger
            asChild
            onClick={() => {
              // add a editMode url param to the profile page
              // this will allow the profile page to know that it should be in edit mode
              // and display the edit form
              router.push(
                `/profile/${user?.id.replace("did:privy:", "")}?editMode=true`
              );
            }}
          >
            <DropdownMenuItem className='text-gray-500 text-sm font-medium font-body leading-[21px]'>
              Edit profile
            </DropdownMenuItem>
          </DialogTrigger>
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
      <DialogContent className='sm:max-w-[425px] h-full bg-[#e1effe] font-body m-auto py-8 overflow-scroll'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
            EDIT PROFILE
          </DialogTitle>
          <div
            className='
          text-gray-700 text-sm font-semibold font-body leading-[21px]'
          >
            We ask that you please confirm your identity by connecting at least
            one social authenticator.
          </div>
        </DialogHeader>
        {(!userProfileData && !userProfileError) || userProfileDataLoading ? (
          <>
            <LoaderIcon className='w-10 h-10 m-auto animate-spin' />
          </>
        ) : (
          <ProfileEditForm
            onSubmit={async (formDetails: {
              name: string;
              email: string;
              bio: string;
              bestProfile: string;
              tempPhotoUrl: string | null;
            }) => {
              await handleSubmitForm(formDetails);
              setOpen(false);
              router.push(`/profile/${user?.id.replace("did:privy:", "")}`);
              await refetchUserProfile();
            }}
            isEditMode
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
