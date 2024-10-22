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
import React, { useCallback, useEffect, useState } from "react";
import { ProfileEditForm } from "../profile/ProfileEdit";
import { LoaderIcon } from "lucide-react";
import { UserCombinedProfile } from "@/types/return_types";
import { fetchUserProfile } from "@/lib/api/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProfileSettings } from "../profile/ProfileSettings";

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
            <AvatarImage src={data?.profile?.photo_source ?? undefined} />
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
  const { user, getAccessToken } = usePrivy();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [dialogMode, setDialogMode] = useState<"edit" | "settings">("edit");

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

  const handleSubmitEditForm = async (form: {
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
    const image =
      form.bestProfile === "twitter" || form.bestProfile === "x"
        ? user?.linkedAccounts.find(
            (account) => account.type === "twitter_oauth"
          )?.profilePictureUrl
        : form.bestProfile === "farcaster"
        ? user?.linkedAccounts.find((account) => account.type === "farcaster")
            ?.pfp
        : form.bestProfile === "telegram"
        ? user?.linkedAccounts.find((account) => account.type === "telegram")
            ?.photoUrl
        : null;
    console.log("🚀 ~ AvatarMenu ~ image:", image);

    const res = await fetch(`/api/users/save-user-profile`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: formToSubmit.name,
        photo_source: image ?? userProfileData?.profile?.photo_source,
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

  const handleSubmitForm = async (form: {
    calendar: string;
    fee: string;
    bookingDescription: string;
    isAvailable: boolean;
    position: string;
    employmentType: string;
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
        calendly_link: formToSubmit.calendar,
        unlock_calendar_fee: formToSubmit.fee,
        booking_description: formToSubmit.bookingDescription,
        available: formToSubmit.isAvailable,
        position: [formToSubmit.position],
        employment_type: [formToSubmit.employmentType],
        privy_did: user?.id,
        name: userProfileData?.profile?.name,
        photo_source: userProfileData?.profile?.photo_source,
        preferred_profile: userProfileData?.profile?.preferred_profile,
        bio: userProfileData?.profile?.bio,
        smart_wallet_address: userProfileData?.profile?.smart_wallet_address,
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
          const params = new URLSearchParams(searchParams.toString());
          params.delete("editMode"); // Removes editMode parameter
          router.replace(pathname + "?" + params.toString());
          await refetchUserProfile(); // Refresh the user profile after dialog is closed
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
          <DialogTrigger asChild onClick={() => setDialogMode("edit")}>
            <DropdownMenuItem className='text-gray-500 text-sm font-medium font-body leading-[21px]'>
              Edit profile
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={() => setDialogMode("settings")}>
            <DropdownMenuItem className='text-gray-500 text-sm font-medium font-body leading-[21px]'>
              Settings
            </DropdownMenuItem>
          </DialogTrigger>
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
      {dialogMode === "edit" ? (
        <DialogContent className='sm:max-w-[425px] h-full bg-[#e1effe] font-body w-full py-8 overflow-scroll'>
          <DialogHeader className='flex flex-col gap-3'>
            <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
              EDIT PROFILE
            </DialogTitle>
            <div
              className='
          text-gray-700 text-sm font-semibold font-body leading-[21px] text-center'
            >
              We ask that you please confirm your identity by connecting at
              least one social authenticator.
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
                await handleSubmitEditForm(formDetails);
                setOpen(false);
                await refetchUserProfile(); // Refresh the user profile after dialog is closed
              }}
              isEditMode
            />
          )}
        </DialogContent>
      ) : dialogMode === "settings" ? (
        <DialogContent className='sm:max-w-[425px] h-auto bg-[#e1effe] font-body w-full py-8 overflow-scroll'>
          <DialogHeader className='flex flex-col gap-3'>
            <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
              Settings
            </DialogTitle>
          </DialogHeader>
          {(!userProfileData && !userProfileError) || userProfileDataLoading ? (
            <>
              <LoaderIcon className='w-10 h-10 m-auto animate-spin' />
            </>
          ) : (
            <ProfileSettings
              onSubmit={async (formDetails) => {
                await handleSubmitForm(formDetails);
                setOpen(false);
              }}
              onClose={() => setOpen(false)}
              isSettingsMode
            />
          )}
        </DialogContent>
      ) : null}{" "}
    </Dialog>
  );
};
