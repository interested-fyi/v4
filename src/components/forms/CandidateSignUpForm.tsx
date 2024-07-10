"use client";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { useFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import { useToast } from "../ui/use-toast";
import { fetchFollowStatus } from "@/app/utils/helpers";
import { ExternalEd25519Signer } from "@standard-crypto/farcaster-js";

import { Label } from "../ui/label";
import { privyClient } from "@/lib/privyClient";
import Modal from "../composed/modals/Modal";
import { DialogTrigger } from "@radix-ui/react-dialog";
export default function CandidateSignUpForm() {
  const [acceptDC, setAcceptDC] = useState(false);
  const [openToWork, setOpenToWork] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const { toast } = useToast();
  const { user } = usePrivy();
  const {
    requestFarcasterSignerFromWarpcast,
    getFarcasterSignerPublicKey,
    signFarcasterMessage,
  } = useFarcasterSigner();

  const privySigner = new ExternalEd25519Signer(
    signFarcasterMessage,
    getFarcasterSignerPublicKey
  );

  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster"
  );
  const hasSigner = user?.linkedAccounts?.find(
    (account) => account.type === "farcaster"
  )?.signerPublicKey;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["follow-status"],
    queryFn: () => fetchFollowStatus(user),
  });

  const isFollowing = data?.following || hasFollowed;

  const handleCreateSigner = async () => {
    if (!farcasterAccount?.signerPublicKey) {
      try {
        await requestFarcasterSignerFromWarpcast();
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            "There was an error creating your Farcaster signer - " +
            error.message,
        });
        console.error("🚀 ~ handleFollowInterestedFyi ~ error:", error);
        return;
      }
    }
    return;
  };

  const handleFollowInterestedFyi = async () => {
    setIsLoadingFollow(true);
    if (!hasSigner) {
      await handleCreateSigner();
      return;
    }

    if (!user?.farcaster?.fid || !process.env.NEXT_PUBLIC_INTERESTED_FYI_FID) {
      toast({
        title: "Error",
        description: "There was an error following @interestedfyi",
      });
      return;
    }

    const followUserResponse = await privyClient.followUser(
      parseInt(process.env.NEXT_PUBLIC_INTERESTED_FYI_FID),
      user.farcaster.fid,
      privySigner
    );

    if (followUserResponse.hash) {
      toast({
        title: "Followed @interestedfyi",
        description: "Successfully followed @interestedfyi", // TODO - update description
      });
      refetch();
      setHasFollowed(true);
    }
    setIsLoadingFollow(false);
  };

  const handleAcceptDC = async () => {
    // TODO - implement functionality to check if user has accepted DCs
    // Need to research
    setAcceptDC(!acceptDC);
  };

  const handleOpenToWork = async () => {
    setOpenToWork(!openToWork);
  };

  const submitForm = async () => {
    // TODO - implement functionality to submit form
    const result = await fetch("/api/create-candidate", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user,
        acceptDC,
        openToWork,
      }),
    });
    if (!result.ok) {
      toast({
        title: "Error",
        description:
          "There was an error creating your profile. Please try again.",
      });
      return;
    }
    const modalButton = document.getElementById("modalButton");
    if (modalButton) {
      modalButton.click();
    }

    return;
  };

  return (
    <div className='flex flex-col justify-center items-center gap-8 bg-[#919CF480] p-8 rounded-xl font-body'>
      <div className='flex flex-col w-full gap-8 justify-start'>
        <div className='flex flex-col gap-4'>
          <div className='items-top flex space-x-2 text-white'>
            <Checkbox
              id='acceptCast'
              className='h-6 w-6 border border-white checked:bg-[#8A63D2]'
              checked={acceptDC}
              onClick={() => handleAcceptDC()}
            />
            <div className='grid gap-1.5 leading-none items-center'>
              <Label
                htmlFor='acceptCast'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Get notifications via direct casts on warpcast (optional)
              </Label>
            </div>
          </div>
          <div className='items-top flex space-x-2 text-white'>
            <Checkbox
              id='openToWork'
              className='h-6 w-6 border border-white checked:bg-[#8A63D2]'
              checked={openToWork}
              onClick={() => handleOpenToWork()}
            />
            <div className='grid gap-1.5 leading-none items-center'>
              <Label
                htmlFor='openToWork'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Are you open to work opportunities?
              </Label>
            </div>
          </div>
        </div>
        {/* Check if user follows interested.fyi and prompt if not */}
        <div className='flex flex-col justify-start min-h-24 gap-4 text-white'>
          <>
            <p className='text-lg font-bold'>
              Follow{" "}
              <a
                className='text-[#E8FC6C]'
                href='https://warpcast.com/interestedfyi'
                target='_blank'
              >
                @interestedfyi
              </a>{" "}
              on Farcaster
            </p>
            <Button
              size='lg'
              onClick={handleFollowInterestedFyi}
              disabled={isFollowing || isLoadingFollow || !user?.farcaster?.fid}
              className='flex items-center max-w-full w-96 gap-4 py-8 shadow-md border bg-[#7c58c1] hover:bg-[#986de8] rounded-xl'
            >
              <Image
                className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
                src='/fc-logo-transparent-white.png'
                alt='Farcaster Logo'
                width={40}
                height={50}
                priority
              />
              {isFollowing ? (
                <p className='text-xl font-bold text-white'>Following</p>
              ) : (
                <p className='text-xl font-bold text-white'>Follow</p>
              )}
            </Button>
          </>
        </div>
        {isFollowing ? (
          <Button
            size='lg'
            onClick={submitForm}
            className='rounded-xl py-8 border border-[#E8FC6C] w-96 max-w-full bg-[#2640EB] text-[#E8FC6C] font-bold text-xl shadow-md'
          >
            Create Profile
          </Button>
        ) : null}
      </div>
      <Modal
        title="Thanks for signing up, we'll be online soon."
        description="Make sure to follow along with us on our official account so you don't miss an update or message from us in the future."
        trigger={
          <DialogTrigger id='modalButton' className='hidden'>
            Open
          </DialogTrigger>
        }
      />
    </div>
  );
}
