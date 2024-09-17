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
import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ProfileConnections } from "../profile/ProfileConnections";

enum PROFILE_TYPE {
  GITHUB = "github",
  LINKEDIN = "linkedin",
  TELEGRAM = "telegram",
  TWITTER = "twitter",
  FARCASTER = "farcaster",
}

export default function AuthDialog() {
  const [open, setOpen] = useState(true);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { user, getAccessToken } = usePrivy();
  const {
    data: userProfileData,
    isLoading: userProfileDataLoading,
    error: userProfileError,
  } = useQuery({
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

  const handleSelectPhoto = async (photoUrl: string) => {
    const accessToken = await getAccessToken();
    const res = await fetch(`/api/users/profiles/update-photo/${user?.id}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        photoSource: photoUrl,
        privyDid: user?.id,
      }),
    });
    if (res.ok) {
      setTempPhotoUrl(photoUrl);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px] h-full bg-[#e1effe] font-body m-auto py-8'>
        <DialogHeader className='flex flex-col gap-5'>
          <DialogTitle className='text-2xl font-bold font-heading text-center mt-8'>
            COMPLETE YOUR PROFILE
          </DialogTitle>
          <div className='text-center mb-4 font-body'>
            We ask that you please confirm your identity by connecting at least
            one social authenticator.
          </div>
        </DialogHeader>
        {(!userProfileData && !userProfileError) || userProfileDataLoading ? (
          <>
            <LoaderIcon className='w-10 h-10 m-auto animate-spin' />
          </>
        ) : (
          <>
            <div className='flex flex-col items-center gap-0 mb-2'>
              <Avatar className='w-24 h-24 border-blue-700 border-2'>
                <AvatarImage
                  src={tempPhotoUrl ?? userProfileData?.profile.photo_source}
                />
                <AvatarFallback>CL</AvatarFallback>
              </Avatar>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='link' className='text-blue-700'>
                    Change photo
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px] bg-[#e1effe] font-body m-auto py-8'>
                  <DialogHeader className='flex flex-col gap-5'>
                    <DialogTitle className='text-2xl font-bold font-heading text-center mt-8'>
                      Select your photo
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
                                Select
                              </Button>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className='grid gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                  <Label className='text-sm font-medium' htmlFor='firstName'>
                    First Name
                  </Label>
                  <Input
                    className='rounded-lg'
                    id='firstName'
                    placeholder='Chester'
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value.trim() })
                    }
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label className='text-sm font-medium' htmlFor='lastName'>
                    Last Name
                  </Label>
                  <Input
                    className='rounded-lg'
                    id='lastName'
                    placeholder='LaCroix'
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value.trim() })
                    }
                  />
                </div>
              </div>
              <div>
                <Label className='text-sm font-medium' htmlFor='email'>
                  Your email
                </Label>
                <Input
                  className='rounded-lg'
                  id='email'
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value.trim() })
                  }
                  placeholder='chesterlacroix@pm.me'
                />
              </div>
            </div>

            <ProfileConnections
              setTempPhotoUrl={setTempPhotoUrl}
              userProfileData={userProfileData}
            />

            <Button
              className='w-full mt-4 bg-[#2640eb]'
              disabled={!form.firstName || !form.lastName || !form.email}
            >
              Continue
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
