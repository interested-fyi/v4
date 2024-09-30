"use client";
import Image from "next/image";
import { PostAJob } from "@/components/PostAJobDialog";
import Explore from "@/components/composed/explore";
import AuthDialog from "@/components/composed/dialog/AuthDialog";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const { user } = usePrivy();
  const [dialogClosed, setDialogClosed] = useState(false);
  // Fetch companies with pagination
  const { data: userProfileData, isLoading: userProfileLoading } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id.replace("did:privy:", "")],
    queryFn: async () => {
      const res = await fetch(
        `/api/users/${user?.id.replace("did:privy:", "")}`,
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
        profile: any;
      };
    },
  });

  console.log(`show dialog: ${!dialogClosed && !!user && !userProfileData?.profile && !userProfileLoading}\nDialog Closed: ${dialogClosed}\nUser: ${JSON.stringify(user)}\nUser Profile Data: ${JSON.stringify(userProfileData)}\nUser Profile Loading: ${userProfileLoading}`);

  return (
    <main className='flex  min-h-screen flex-col gap-0 items-center justify-start '>
      <section className='w-full max-w-full bg-[#2640EB] py-24 sm:p-8 p-2 md:p-24'>
        <div className='flex relative lg:flex-row flex-col w-full'>
          <div className='flex flex-col gap-8 relative z-10'>
            <div className='flex flex-col text-center gap-6 md:gap-4 max-w-[303px] m-auto'>
              <h1 className='font-heading text-4xl md:text-6xl font-bold text-[#919CF4] '>
                FIND A CRYPTO JOB THAT
                <span className='font-heading text-4xl md:text-6xl font-bold text-[#ffffff] '>
                  {" "}
                  INTERESTS YOU.
                </span>
              </h1>
              <p className='text-[#919cf4] text-sm font-semibold font-body leading-[21px] max-w-[254px] mx-auto'>
                Explore companies and organizations hiring across the web3
                ecosystem.
              </p>
              <PostAJob />
            </div>
            {/* <p className='text-[16px]  font-body text-[#ffffff] max-w-[548px]'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p> */}
          </div>

          <div className='absolute right-0 md:right-10 top-0 h-full w-[50vw] z-[0] hidden lg:flex place-items-center'>
            <div className='relative h-full w-full'>
              <Image
                className='dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
                src='/svg/illustration.svg'
                alt='Interested illustration'
                sizes='50vw'
                fill
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <section className='w-full bg-[#e1effe]'>
        <Explore />
        {
          <AuthDialog
            isOpen={
              !dialogClosed && !!user && !userProfileData?.profile && !userProfileLoading
            }
            onClose={() => {
              setDialogClosed(true);
            }}
          />
        }
      </section>
    </main>
  );
}
