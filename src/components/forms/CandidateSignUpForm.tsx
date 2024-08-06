"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { fetchFollowStatus } from "@/app/utils/helpers";
import Modal from "../composed/modals/Modal";
import { DialogTrigger } from "@radix-ui/react-dialog";
import Link from "next/link";

export default function CandidateSignUpForm() {
  const [joinTelegram, setJoinTelegram] = useState(false);

  const handlejoinTelegram = async () => {
    // TODO - implement functionality to check if user has accepted DCs
    // Need to research
    setJoinTelegram(!joinTelegram);
  };

  return (
    <div className='flex flex-col justify-center items-center gap-8 bg-[#919CF480] p-8 rounded-xl font-body'>
      <div className='flex flex-col w-full gap-8 justify-start'>
        <Button
          size='lg'
          onClick={handlejoinTelegram}
          className='flex items-center justify-center max-w-full w-96 py-8 shadow-md border bg-[#0088cc] hover:bg-[#007ab8] text-white hover:text-white rounded-xl'
        >
          Join the Interested Telegram channel
        </Button>
        <Link href='/explore'>
          <Button
            size='lg'
            className='max-w-full w-96 py-8 shadow-md border bg-[#7c58c1] hover:bg-[#986de8] rounded-xl'
          >
            Explore work opportunities
          </Button>
        </Link>
      </div>
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
          disabled={isFollowing || !user?.telegram?.telegramUserId}
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
