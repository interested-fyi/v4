"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ProfileConnections } from "../profile/ProfileConnections";
import { Textarea } from "@/components/ui/textarea";
import { UserCombinedProfile } from "@/types/return_types";

interface Props {
  onSubmit: (formDetails: {
    name: string;
    email: string;
    bio: string;
    bestProfile: string;
    tempPhotoUrl: string | null;
  }) => void;
}

export const ProfileEditForm = ({ onSubmit }: Props) => {
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    bestProfile: "",
  });

  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);

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

  useEffect(() => {
    if (userProfileData?.success) {
      setForm({
        name: user?.google?.name ?? "",
        email: user?.google?.email ?? "",
        bio: userProfileData.profile?.bio ?? "",
        bestProfile: userProfileData.profile?.preferred_profile ?? "",
      });
    }
  }, [userProfileData]);

  useEffect(() => {
    const isFormComplete = form.name && form.bio && form.email;
    setIsProfileComplete(!isFormComplete);
  }, [form.name, form.bio, form.email]);

  const handleSelectPhoto = async (photoUrl: string) => {
    setTempPhotoUrl(photoUrl);
  };

  return (
    <>
      <div className='flex flex-col items-center gap-0 mb-0'>
        <Avatar className='w-24 h-24 border-blue-700 border-2'>
          <AvatarImage
            src={tempPhotoUrl ?? userProfileData?.profile?.photo_source ?? ""}
          />
          <AvatarFallback>
            {userProfileData?.profile?.name?.slice(0, 2) ??
              user?.google?.name?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant='link' className='text-blue-700 focus:border-0'>
              Change photo
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px] bg-[#e1effe] font-body m-auto py-8'>
            <DialogHeader className='flex flex-col gap-5'>
              <DialogTitle className='text-2xl font-bold font-heading  mt-8'>
                Select a photo from your linked accounts
              </DialogTitle>

              <div className='flex flex-1'>
                {user?.linkedAccounts?.map(
                  (linkedAccount: any, idx: number) => {
                    const image = linkedAccount.profilePictureUrl;
                    if (!image) return;
                    return (
                      <div className='flex flex-col gap-2' key={idx}>
                        <Image
                          width={10}
                          height={10}
                          className='w-10 h-10 m-auto rounded-full justify-center items-center'
                          src={image ?? ""}
                          alt={linkedAccount.username}
                        />
                        <Button
                          key={linkedAccount}
                          className='w-full bg-[#2640eb]'
                          onClick={() => handleSelectPhoto(image)}
                        >
                          {linkedAccount.type.replace("_oauth", "")}
                        </Button>
                      </div>
                    );
                  }
                )}
              </div>
              <span className='text-sm font-light font-body'>
                connect more accounts to see more options
              </span>
              <ProfileConnections
                setTempPhotoUrl={setTempPhotoUrl}
                userProfileData={userProfileData}
                onSetBestProfile={(bestProfile) =>
                  setForm({ ...form, bestProfile: bestProfile })
                }
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className='grid gap-4'>
        <div>
          <Label className='text-sm font-medium' htmlFor='name'>
            Your name
          </Label>
          <Input
            className='rounded-lg'
            id='name'
            defaultValue={form?.name ?? ""}
            onChange={(e) => setForm({ ...form, name: e.target.value.trim() })}
            placeholder='chesterlacroix@pm.me'
          />
        </div>
        <div>
          <Label className='text-sm font-medium' htmlFor='email'>
            Your email
          </Label>
          <Input
            className='rounded-lg'
            id='email'
            disabled
            defaultValue={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value.trim() })}
            placeholder='chesterlacroix@pm.me'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label className='text-sm font-medium' htmlFor='bio'>
            {`Short bio (<180 characters)`}
          </Label>
          <Textarea
            className='rounded-lg'
            id='bio'
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
      </div>

      <ProfileConnections
        setTempPhotoUrl={setTempPhotoUrl}
        userProfileData={userProfileData}
        onSetBestProfile={(bestProfile) =>
          setForm({ ...form, bestProfile: bestProfile })
        }
      />

      <Button
        className='w-full text-sm font-body font-medium leading-[21px] mt-4 bg-[#2640eb]'
        disabled={isProfileComplete}
        onClick={() => onSubmit({ ...form, tempPhotoUrl })}
      >
        Continue
      </Button>
    </>
  );
};
