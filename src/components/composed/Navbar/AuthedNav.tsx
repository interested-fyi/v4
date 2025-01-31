"use client";
import { NavButtons } from "./NavButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
import { Loader, LoaderIcon } from "lucide-react";
import { UserCombinedProfile } from "@/types/return_types";
import { fetchUserProfile } from "@/lib/api/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchCompletedTasks } from "@/components/Quest";
import { QuestPoints } from "../quest/QuestPoints";

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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            <Avatar className='h-8 w-8'>
              <AvatarImage src={data?.profile?.photo_source ?? undefined} />
              <AvatarFallback>{user?.google?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </motion.div>
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

  const { data: questStatus, isLoading: isQuestSTatusLoading } = useQuery<{
    completedTaskIds: string[];
    totalPoints: number;
  }>({
    enabled: !!user,
    queryKey: ["completedTasks", user?.id],
    queryFn: async () => {
      if (user) {
        return await fetchCompletedTasks(user.id);
      }
      return {
        completedTaskIds: [],
        totalPoints: 0,
      };
    },
  });

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
    calendar: string;
    fee: string;
    bookingDescription: string;
    geography: string;
    isAvailable: boolean;
    position: string[];
    employmentType: string[];
    tempPhotoUrl: string | null;
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
        calendly_link: formToSubmit.calendar,
        unlock_calendar_fee: formToSubmit.fee,
        booking_description: formToSubmit.bookingDescription,
        geography: formToSubmit.geography,
        available: formToSubmit.isAvailable,
        position: formToSubmit.position,
        employment_type:
          typeof formToSubmit.employmentType === "string"
            ? [formToSubmit.employmentType]
            : formToSubmit.employmentType,
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
          const params = new URLSearchParams(searchParams.toString());
          params.delete("editMode"); // Removes editMode parameter
          router.replace(pathname + "?" + params.toString());
          await refetchUserProfile(); // Refresh the user profile after dialog is closed
        }
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: [0, "100px", "86px"] }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='flex cursor-pointer md:bottom-1 relative gap-1 border-blue-700 border-[1px] rounded-full shadow-inner p-1 justify-end'
          >
            {!questStatus?.totalPoints && isQuestSTatusLoading ? null : (
              <QuestPoints
                className='flex text-xs'
                totalPoints={questStatus?.totalPoints ?? 0}
              />
            )}
            {avatar}
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className='text-gray-500 text-sm font-medium font-body leading-[21px]'>
            <Link
              href={`/profile/${user?.id.replace("did:privy:", "")}`}
              onClick={() => {
                setOpen(false);
                router.push(`/profile/${user?.id.replace("did:privy:", "")}`);
              }}
            >
              View profile
            </Link>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem className='text-gray-500 text-sm font-medium font-body leading-[21px]'>
              Edit profile
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
      <DialogContent className='sm:max-w-[425px] h-full bg-[#e1effe] font-body w-full py-8 overflow-scroll'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
            EDIT PROFILE
          </DialogTitle>
          <div
            className='
          text-gray-700 text-sm font-semibold font-body leading-[21px] text-center'
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
              calendar: string;
              fee: string;
              bookingDescription: string;
              isAvailable: boolean;
              geography: string;
              position: string[];
              employmentType: string[];
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
    </Dialog>
  );
};
