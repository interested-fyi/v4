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
import { Textarea } from "@/components/ui/textarea";

export default function AuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    calendar: "",
    fee: "",
    bookingDescription: "",
  });
  const [step, setStep] = useState(0);
  const [activeButton, setActiveButton] = useState<"yes" | "no">("yes");

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

  const handleButtonClick = (button: "yes" | "no") => {
    setActiveButton(button);
  };

  const handleSubmitForm = async () => {
    //  TODO: Implement form submission
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
            <>
              <div className='flex flex-col items-center gap-0 mb-0'>
                <Avatar className='w-24 h-24 border-blue-700 border-2'>
                  <AvatarImage
                    src={tempPhotoUrl ?? userProfileData?.profile.photo_source}
                  />
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='link'
                      className='text-blue-700 focus:border-0'
                    >
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
                    defaultValue={user?.google?.name ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value.trim() })
                    }
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
                    defaultValue={user?.google?.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value.trim() })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, bio: e.target.value.trim() })
                    }
                  />
                </div>
              </div>

              <ProfileConnections
                setTempPhotoUrl={setTempPhotoUrl}
                userProfileData={userProfileData}
              />

              <Button
                className='w-full text-sm font-body font-medium leading-[21px] mt-4 bg-[#2640eb]'
                disabled={!form.name || !form.bio || !form.email}
                onClick={() => setStep(1)}
              >
                Continue
              </Button>
            </>
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
            <div className='text-center text-[#1e1e1e] text-sm font-bold font-heading leading-[14px]'>
              <p className='mb-1'>READY TO APPEAR ON OUR TALENT PAGE?</p>
              <div className='flex gap-4 relative max-w-full'>
                <Button
                  size='lg'
                  className={`w-40 md:w-[180px] max-w-full rounded-[8px] font-heading font-bold uppercase justify-center text-center ${
                    activeButton === "yes"
                      ? "bg-[#2640EB] hover:bg-blue-600 hover:text-white text-yellow-200"
                      : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
                  }`}
                  onClick={() => handleButtonClick("yes")}
                >
                  YES!
                </Button>

                <Button
                  size='icon'
                  onClick={() =>
                    activeButton === "no"
                      ? handleButtonClick("yes")
                      : handleButtonClick("no")
                  }
                  className='bg-transparent hover:bg-transparent active:scale-95 transition-all duration-100 absolute right-[45%]'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='36'
                    height='37'
                    viewBox='0 0 36 37'
                    fill='none'
                  >
                    <rect
                      x='1'
                      y='1.5'
                      width='34'
                      height='34'
                      rx='17'
                      fill='white'
                    />
                    <rect
                      x='1'
                      y='1.5'
                      width='34'
                      height='34'
                      rx='17'
                      stroke='#2640EB'
                      strokeWidth='2'
                    />
                    <path
                      d='M23.7826 21.6874L9.90039 21.6874L9.90039 22.9623L23.7826 22.9623L21.0512 25.6994L21.9537 26.6L26.2199 22.3248L21.9537 18.0497L21.0512 18.9503L23.7826 21.6874Z'
                      fill='#2640EB'
                    />
                    <path
                      d='M14.1664 10.4L9.90015 14.6751L14.1664 18.9503L15.0689 18.0497L12.3375 15.3126L26.2197 15.3126L26.2197 14.0377L12.3375 14.0377L15.0689 11.3006L14.1664 10.4Z'
                      fill='#2640EB'
                    />
                  </svg>
                </Button>
                <Button
                  size='lg'
                  className={`w-40 md:w-[180px] rounded-[8px] font-heading font-bold uppercase justify-center ${
                    activeButton === "no"
                      ? "bg-[#2640EB] text-white hover:bg-blue-600 hover:text-white"
                      : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
                  }`}
                  onClick={() => handleButtonClick("no")}
                >
                  MAYBE LATER
                </Button>
              </div>
            </div>
            <div className='w-[343px] text-center text-gray-700 text-sm font-semibold font-body leading-[21px] pt-5 '>
              If you&apos;re on our talent page and looking for work, having
              prospective companies and recruiters book a call with you is a
              great first step.
              <br />
              <br />
              (You can also do this later in settings).
            </div>
          </DialogHeader>
          <div className='grid gap-4'>
            <div>
              <Label className='text-sm font-medium' htmlFor='calendar'>
                Scheduling link (Calendly, etc)
              </Label>
              <Input
                className='rounded-lg'
                id='calendar'
                onChange={(e) =>
                  setForm({ ...form, calendar: e.target.value.trim() })
                }
              />
            </div>
            <div>
              <Label className='text-sm font-medium' htmlFor='fee'>
                Fee to unlock your calendar:
              </Label>
              <Input
                className='rounded-lg'
                id='fee'
                onChange={(e) =>
                  setForm({ ...form, fee: e.target.value.trim() })
                }
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label
                className='text-sm font-medium'
                htmlFor='bookingDescription'
              >
                {`Description of your booking: (<180 characters)`}
              </Label>
              <Textarea
                className='rounded-lg'
                id='bookingDescription'
                onChange={(e) =>
                  setForm({
                    ...form,
                    bookingDescription: e.target.value.trim(),
                  })
                }
              />
            </div>
            <Button
              variant={"link"}
              className='text-center text-[#2640eb] text-sm font-medium font-body leading-[21px]'
            >
              Don&apos;t have a calendar? Create one
            </Button>
          </div>

          <Button
            className='w-full text-sm font-body font-medium leading-[21px] mt-4 bg-[#2640eb]'
            disabled={!form.name || !form.bio || !form.email}
            onClick={() => setStep(1)}
          >
            Save and continue to Interested
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
}
