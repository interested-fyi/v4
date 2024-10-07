"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { UserCombinedProfile } from "@/types/return_types";
import Link from "next/link";
import { useParams } from "next/navigation";
import EndorseDialog from "@/components/composed/dialog/EndorseDialog";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const [endorseDialogOpen, setEndorseDialogOpen] = useState(false);

  const { user } = usePrivy();
  const params = useParams();
  const { toast } = useToast();

  const privyDid = params.privyDid as string;
  const { data: userProfileData, isLoading: userProfileLoading } = useQuery({
    enabled: !!privyDid,
    queryKey: ["user", privyDid.replace("did:privy:", "")],
    queryFn: async () => {
      const res = await fetch(
        `/api/users/${privyDid.replace("did:privy:", "")}`,
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
        profile: UserCombinedProfile;
      };
    },
  });

  const handleCopyToClipboard = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${privyDid}`
      );
    }
    toast({
      title: "Copied to clipboard",
      description: "Your profile link has been copied to your clipboard.",
    });
  };

  if (userProfileLoading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-[#2640eb] text-white p-4 pt-0 px-0 md:p-8'>
        <div className='relative w-full max-w-5xl bg-white overflow-hidden shadow-lg rounded-lg'>
          <div className='bg-[#2640eb] h-[135px]'></div>
          <div className='relative px-4 pb-4 bg-[#e1effe] flex flex-col justify-center items-center min-h-[400px]'>
            <p className='text-lg text-gray-700 font-semibold'>
              Fetching Profile...
            </p>
            <Loader className='animate-spin mt-6 text-blue-700' />
          </div>
        </div>
      </div>
    );
  }

  const socialLinks = [
    {
      platform: "telegram",
      url: userProfileData?.profile?.telegram_username
        ? `https://t.me/${userProfileData?.profile?.telegram_username}`
        : null,
      image: "/svg/blue-logos/telegram.svg",
      alt: "telegram",
    },
    {
      platform: "github",
      url: userProfileData?.profile?.github_username
        ? `https://github.com/${userProfileData?.profile?.github_username}`
        : null,
      image: "/svg/blue-logos/github.svg",
      alt: "github",
    },
    {
      platform: "linkedin",
      url: userProfileData?.profile?.linkedin_name
        ? `https://linkedin.com/in/${userProfileData?.profile?.linkedin_name}`
        : null,
      image: "/svg/blue-logos/linkedin.svg",
      alt: "linkedin",
    },
    {
      platform: "farcaster",
      url: userProfileData?.profile?.farcaster_username
        ? `https://warpcast.com/${userProfileData?.profile?.farcaster_username}`
        : null,
      image: "/svg/blue-logos/farcast.svg",
      alt: "farcaster",
    },
    {
      platform: "x",
      url: userProfileData?.profile?.x_username
        ? `https://x.com/${userProfileData?.profile?.x_username}`
        : null,
      image: "/svg/blue-logos/x.svg",
      alt: "x",
    },
  ];

  const connectedSocials = socialLinks.filter((social) => social.url);

  return (
    <div className='flex flex-col items-center min-h-screen bg-[#2640eb] text-white p-4 pt-0 px-0 md:p-8'>
      <div className='relative w-full max-w-5xl bg-white overflow-hidden'>
        <div className='bg-[#2640eb] h-[135px]'></div>
        <div className='relative px-4 pb-4 bg-[#e1effe]'>
          <Avatar className='w-[140px] h-[140px] border-4 border-white rounded-full absolute -top-[100px] left-1/2 transform -translate-x-1/2'>
            <AvatarImage
              src={
                userProfileData?.profile?.photo_source ??
                userProfileData?.profile?.preferred_photo ??
                ""
              }
              alt='Profile picture'
            />
            <AvatarFallback>
              {userProfileData?.profile?.name?.slice(0, 2) ??
                user?.google?.name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className='pt-16 flex flex-col gap-2 text-center max-w-[343px] mx-auto'>
            <h1 className='text-[#2640eb] text-xl font-semibold font-body leading-[30px]'>
              {userProfileData?.profile?.name ?? "Chester LaCroix"}
            </h1>
            <p className='text-gray-700 text-sm font-semibold font-body leading-[21px]'>
              {userProfileData?.profile?.bio ??
                "Short bio here? Do we have this in the profile editing flow somewhere - yes we do"}
            </p>
            <div className='absolute -top-28 right-0'>
              {user?.id ===
              userProfileData?.profile?.privy_did ? //     alt='edit' //     src='/svg/pencil.svg' //   <Image // <Button className='h-8 pl-[11px] pr-3 py-2 bg-[#919cf4] hover:bg-[#919cf4] hover:bg-opacity-90 rounded-lg justify-center items-center gap-2 inline-flex'>
              //     height={16}
              //     width={16}
              //   />
              // </Button>
              null : (
                <Button
                  onClick={handleCopyToClipboard}
                  className='h-8 pl-[11px] pr-3 py-2 bg-[#919cf4] hover:bg-[#919cf4] hover:bg-opacity-90 rounded-lg justify-center items-center gap-2 inline-flex'
                >
                  <Image
                    src='/svg/share.svg'
                    alt='like'
                    height={16}
                    width={16}
                  />
                </Button>
              )}
            </div>
          </div>
          <div className='flex justify-center gap-2 mt-8 max-w-[343px] mx-auto'>
            {/* <Button
              className='flex-1 bg-white border border-black text-gray-700 text-xs font-medium font-body leading-[18px] hover:bg-[#2640eb] hover:text-yellow-200
            '
            >
              Support builder
              <Image
                className='ml-2'
                src={"/svg/gift.svg"}
                alt='gift'
                height={16}
                width={16}
              />
            </Button> */}
            <Button
              className='flex-1 bg-white border border-black text-gray-700 text-xs font-medium font-body leading-[18px] hover:bg-[#2640eb] hover:text-yellow-200'
              onClick={() => setEndorseDialogOpen(true)}
            >
              Endorse
              <Image
                className='ml-2'
                src={"/svg/hand.svg"}
                alt='hand'
                height={16}
                width={16}
              />
            </Button>
            {endorseDialogOpen && userProfileData?.profile && (
              <EndorseDialog
                isOpen={endorseDialogOpen}
                onClose={() => setEndorseDialogOpen(false)}
                user={userProfileData?.profile as UserCombinedProfile}
              />
            )}
          </div>
          {/* <div className='w-full flex justify-center mt-4'>
            <div className='w-[343px] h-[34px] relative'>
              <div className='w-[343px] h-[34px] pl-3 pr-[11px] py-2 left-0 top-1 absolute opacity-40 bg-white rounded-lg border border-gray-700 blur-[3px] justify-center items-center gap-2 inline-flex'>
                <div className='text-gray-700 text-xs font-medium font-body leading-[18px]'>
                  Schedule a call
                </div>
                <div className='w-4 h-4 relative' />
              </div>
              <Button
                variant={"link"}
                className='w-[343px]  hover:no-underline bg-transparent absolute text-center text-[#2640eb] text-sm font-semibold font-body leading-[21px]'
              >
                Unlock scheduling for $15
              </Button>
            </div>
          </div> */}
          <div className='flex justify-start max-w-[343px] mx-auto gap-4 mt-8'>
            {connectedSocials.length > 0 ? (
              connectedSocials.map((social, index) => (
                <Link key={index} target={"_blank"} href={social.url || "#"}>
                  <Button className='bg-[#919cf4] bg-opacity-30 hover:bg-opacity-90 hover:bg-[#919cf4] w-[55px] h-8'>
                    <Image
                      src={social.image}
                      alt={social.alt}
                      height={16}
                      width={16}
                    />
                  </Button>
                </Link>
              ))
            ) : user?.id === userProfileData?.profile?.privy_did ? (
              <Button
                className='flex-1 bg-white border border-black text-gray-700 text-xs font-medium font-body leading-[18px] hover:bg-[#2640eb] hover:text-yellow-200'
                onClick={() => console.log("Link accounts clicked")}
              >
                Link Accounts
                <Image
                  className='ml-2'
                  src={"/svg/link.svg"}
                  alt='link'
                  height={16}
                  width={16}
                />
              </Button>
            ) : null}
          </div>
          {/* <div className='mt-8'>
            <SwitchButtonGroup
              buttons={[
                { text: "ACTIVITY", onClick: () => {}, isActive: true },
                { text: "ENDORSEMENTS", onClick: () => {}, isActive: false },
              ]}
              svgOnClick={() => {}}
            />
          </div> */}
          <h2
            className='
          text-gray-600
text-xl
font-bold
font-body text-center mt-7 mb-6'
          >
            Endorsements
          </h2>
          {[1, 2, 3].map((index) => (
            <Card key={index} className='mb-4 p-4'>
              <div className='flex items-start gap-4'>
                <Avatar>
                  <AvatarImage
                    src='/placeholder.svg?height=40&width=40'
                    alt='Tina Haibodi'
                  />
                  <AvatarFallback>TH</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='font-semibold text-[#2640eb]'>Tina Haibodi</h3>
                  <p className='text-sm text-gray-500 font-medium font-body'>
                    August 14th, 2023
                  </p>
                  <p className='text-sm font-medium font-body leading-[21px] mt-1 text-gray-600'>
                    Friend/Associate
                  </p>
                  <p className='text-xs text-gray-600 font-medium font-body leading-[18px] mt-2'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
