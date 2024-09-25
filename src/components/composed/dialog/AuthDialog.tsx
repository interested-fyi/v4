"use client";

import React from "react";
import { ProfileEditForm } from "../profile/ProfileEdit";
import { ProfileSettings } from "../profile/ProfileSettings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserCombinedProfile } from "@/types/return_types";

export default function AuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    bestProfile: "",
  });
  const [step, setStep] = useState(0);

  const { user, getAccessToken } = usePrivy();

  const {
    data: userProfileData,
    isLoading: userProfileDataLoading,
    error: userProfileError,
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
    calendar: string;
    fee: string;
    bookingDescription: string;
    isAvailable: boolean;
  }) => {
    const accessToken = await getAccessToken();
    const res = await fetch(`/api/users/save-user-profile`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: form.name,
        photo_source: tempPhotoUrl,
        available: form.isAvailable,
        preferred_profile: form.bestProfile,
        bio: form.bio,
        calendly_link: form.calendar,
        unlock_calendar_fee: form.fee,
        booking_description: form.bookingDescription,
        privy_did: user?.id,
      }),
    });
    return (await res.json()) as {
      success: boolean;
      profile: any;
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {step === 0 ? (
        <DialogContent className='sm:max-w-[425px] h-full bg-[#e1effe] font-body m-auto py-8 overflow-scroll'>
          <DialogHeader className='flex flex-col gap-3'>
            <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
              COMPLETE YOUR PROFILE
            </DialogTitle>
            <div
              className='
          text-gray-700 text-sm font-semibold font-body leading-[21px]'
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
              onSubmit={(formDetails: {
                name: string;
                email: string;
                bio: string;
                bestProfile: string;
                tempPhotoUrl: string | null;
              }) => {
                setForm({
                  ...form,
                  name: formDetails.name,
                  email: formDetails.email,
                  bio: formDetails.bio,
                  bestProfile: formDetails.bestProfile,
                });
                setTempPhotoUrl(formDetails.tempPhotoUrl);
                setStep(1);
              }}
            />
          )}
        </DialogContent>
      ) : (
        <DialogContent className='sm:max-w-[425px] h-full bg-[#e1effe] font-body m-auto py-8 overflow-scroll'>
          <DialogHeader className='flex flex-col gap-3'>
            <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
              PROFILE COMPLETE
            </DialogTitle>
            <div className='text-center text-gray-700 text-sm font-semibold font-body leading-[21px]'>
              Thanks for using Interested.FYI! You can edit and add more to your
              profile later. Next, lets get you on the path to finding work that
              interests you.
            </div>
            <ProfileSettings
              onSubmit={(formDetails) => {
                handleSubmitForm({
                  ...form,
                  ...formDetails,
                });
              }}
            />
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}
