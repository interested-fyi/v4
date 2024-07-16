"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "../ui/use-toast";
import { fetchFollowStatus, getCandidateByFID } from "@/app/utils/helpers";
import Modal from "../composed/modals/Modal";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { CheckboxGroup } from "../composed/CheckboxGroup";
import Link from "next/link";
import Candidate from "@/types/candidate";

export default function CandidateSignUpForm() {
  const [acceptDC, setAcceptDC] = useState(false);
  const [openToWork, setOpenToWork] = useState(false);

  const { toast } = useToast();
  const { user, getAccessToken } = usePrivy();

  const { data: account } = useQuery({
    queryKey: ["account-status"],
    queryFn: () => {
      return user?.farcaster?.fid
        ? getCandidateByFID(user?.farcaster?.fid?.toString())
        : null;
    },
  });

  const handleAcceptDC = async () => {
    // TODO - implement functionality to check if user has accepted DCs
    // Need to research
    setAcceptDC(!acceptDC);
  };

  const handleOpenToWork = async () => {
    setOpenToWork(!openToWork);
  };

  const submitForm = async () => {
    if (!account.id) {
      const accessToken = await getAccessToken();
      const result = await fetch("/api/create-candidate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user: {
            created_at: user?.createdAt,
            privy_did: user?.id,
            fid: user?.farcaster?.fid,
            email: user?.email,
            username: user?.farcaster?.username,
          },
          candidate: {
            privy_did: user?.id,
            accept_direct_messages: acceptDC,
            currently_seeking: openToWork,
          } as Candidate,
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
          <CheckboxGroup
            id={"acceptCast"}
            label={"Get notifications via direct casts on warpcast (optional)"}
            checked={acceptDC}
            onChange={handleAcceptDC}
          />
          <CheckboxGroup
            id={"openToWork"}
            label={"Are you open to work opportunities?"}
            checked={openToWork}
            onChange={handleOpenToWork}
          />
        </div>

        <Button
          size='lg'
          onClick={submitForm}
          className='rounded-xl py-8 border border-[#E8FC6C] w-96 max-w-full bg-[#2640EB] text-[#E8FC6C] font-bold text-xl shadow-md'
        >
          Create Profile
        </Button>
      </div>
      <SuccessModal />
    </div>
  );
}

interface FollowSectionProps {
  isFollowing: boolean;
}
const FollowSection = ({ isFollowing }: FollowSectionProps) => {
  const { user } = usePrivy();

  return (
    <div className='flex flex-col justify-start min-h-24 gap-4 text-primary'>
      <p className='text-lg font-bold text-center'>
        Follow{" "}
        <Link
          className='text-[#7c58c1] hover:underline'
          href='https://warpcast.com/interestedfyi'
          target='_blank'
        >
          @interestedfyi
        </Link>{" "}
        on Farcaster
      </p>
      <Link href='https://warpcast.com/interestedfyi' passHref>
        <Button
          size='lg'
          disabled={isFollowing || !user?.farcaster?.fid}
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
      </Link>
    </div>
  );
};

function SuccessModal() {
  const { user } = usePrivy();
  const { data } = useQuery({
    queryKey: ["follow-status"],
    queryFn: () => fetchFollowStatus(user),
  });

  const isFollowing = data?.following;
  return (
    <Modal
      className='items-center justify-center'
      title="Thanks for signing up, we'll be online soon."
      description="Make sure to follow along with us on our official account so you don't miss an update or message from us in the future."
      trigger={
        <DialogTrigger id='modalButton' className='hidden'>
          Open
        </DialogTrigger>
      }
      followButton={<FollowSection isFollowing={isFollowing} />}
    >
      <div className='flex w-full justify-center items-center gap-8'>
        <Image
          src='/main-logo.png'
          alt='Interested illustration'
          width={200}
          height={200}
        />
      </div>
    </Modal>
  );
}
