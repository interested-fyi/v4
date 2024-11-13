"use client";

import React from "react";
import { ProfileEditForm } from "../profile/ProfileEdit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePrivy } from "@privy-io/react-auth";
import { LoaderIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as dotenv from "dotenv";
import { fetchUserProfile } from "@/lib/api/helpers";
dotenv.config();

export default function AuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, getAccessToken } = usePrivy();

  const {
    data: userProfileData,
    isLoading: userProfileLoading,
    isError: userProfileError,
    refetch: refetchUserProfile,
  } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id.replace("did:privy:", "")],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return await fetchUserProfile({ userId: user?.id, accessToken });
    },
  });

  const handleSubmitForm = async (form: {
    name: string;
    email: string;
    bio: string;
    bestProfile: string;
    calendar: string;
    fee: string;
    position: string[];
    employmentType: string[];
    bookingDescription: string;
    isAvailable: boolean;
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
        photo_source: formToSubmit.tempPhotoUrl,
        available: formToSubmit.isAvailable,
        preferred_profile: formToSubmit.bestProfile,
        bio: formToSubmit.bio,
        calendly_link: formToSubmit.calendar,
        unlock_calendar_fee: formToSubmit.fee,
        position: formToSubmit.position,
        employment_type:
          typeof formToSubmit.employmentType === "string"
            ? [formToSubmit.employmentType]
            : formToSubmit.employmentType,
        booking_description: formToSubmit.bookingDescription,
        smart_wallet_address: user?.smartWallet?.address,
        privy_did: user?.id,
      }),
    });
    const resData = await res.json();
    return resData as {
      success: boolean;
      profile: any;
      schema_success: false;
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] h-full bg-[#e1effe] font-body m-auto py-8 overflow-scroll'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
            COMPLETE YOUR PROFILE
          </DialogTitle>
          <div
            className='
          text-gray-700 text-sm font-semibold font-body leading-[21px] text-center'
          >
            We ask that you please confirm your identity by connecting at least
            one social authenticator.
          </div>
        </DialogHeader>
        {(!userProfileData && !userProfileError) || userProfileLoading ? (
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
              isAvailable: boolean;
              calendar: string;
              fee: string;
              bookingDescription: string;
              position: string[];
              employmentType: string[];
            }) => {
              await handleSubmitForm({
                ...formDetails,
              });
              await refetchUserProfile();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
