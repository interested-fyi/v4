"use client";
import Image from "next/image";
import { PostAJob } from "@/components/PostAJobDialog";
import Explore from "@/components/composed/explore";
import AuthDialog from "@/components/composed/dialog/AuthDialog";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUserProfile } from "@/lib/api/helpers";
import Banner from "@/components/composed/popups/Banner";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import StatsBanner, { StatItem } from "@/components/composed/StatsBanner";

export default function Home() {
  const { user, login } = usePrivy();
  const [dialogClosed, setDialogClosed] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const { data: userProfileData, isLoading: userProfileLoading } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id.replace("did:privy:", "")],
    queryFn: async () => await fetchUserProfile({ userId: user?.id }),
  });

  const isUserLoginMessageOpen = params.get("message") === "login";

  return (
    <main className='flex  min-h-screen flex-col gap-0 items-center justify-start '>
      <Banner />
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
          </div>

          <div className='absolute right-0 md:right-10 top-0 h-full w-[50vw] z-[0] hidden lg:flex place-items-center'>
            <div className='relative h-full w-full'>
              <Image
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

      <StatsBanner
        recentCompanies={[
          {
            name: "Coinbase",
            logo: "/svg/coinbase_brand_logo.svg",
            url: "https://www.coinbase.com/",
          },
          {
            name: "Optimism",
            logo: "/svg/op_brand_logo.svg",
            url: "https://www.optimism.io/",
          },

          {
            name: "Consensys",
            logo: "/svg/consensys_brand_logo.svg",
            url: "https://consensys.io/",
          },
          {
            name: "Dune Analytics",
            logo: "/svg/dune_icon.svg",
            url: "https://dune.com/",
          },
          {
            name: "Aztec",
            logo: "/svg/aztec_brand_logo.svg",
            url: "https://aztec.network/",
          },
          {
            name: "Celestia",
            logo: "/svg/celestia_logo.svg",
            url: "https://celestia.org/",
          },
          {
            name: "OpenSea",
            logo: "/svg/opensea_brand_logo.svg",
            url: "https://opensea.io/",
          },
          {
            name: "Ethereum Foundation",
            logo: "/svg/ef_brand_logo.svg",
            url: "https://ethereum.foundation/",
          },
          {
            name: "Privy",
            logo: "/svg/privy_brand_logo.svg",
            url: "https://privy.io/",
          },
        ]}
      />

      <section className='w-full bg-[#e1effe]'>
        <div className='flex space-x-4 justify-center'>
          {/* {[
            {
              label: "Jobs Posted Onchain",
              value: 1202,
              icon: "Sparkles",
            },
            {
              label: "Users Brought Onchain",
              value: 302,
              icon: "Sparkles",
            },
          ].map((stat, index) => (
            <StatItem
              key={index}
              label={stat.label}
              value={stat.value}
              icon={
                stat.icon as "Sparkles" | "Users" | "Briefcase" | "Building"
              }
            />
          ))} */}
        </div>
        <Explore />
        {
          <AuthDialog
            isOpen={
              !dialogClosed &&
              !!user &&
              !userProfileData?.profile &&
              !userProfileLoading
            }
            onClose={() => {
              setDialogClosed(true);
            }}
          />
        }
        <Dialog
          open={isUserLoginMessageOpen}
          onOpenChange={(open) => {
            if (!open) {
              router.push("/");
            }
          }}
        >
          <DialogContent className='sm:max-w-[425px] bg-[#e1effe] font-body m-auto py-8'>
            <DialogHeader className='flex flex-col gap-3'>
              <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
                LOGIN TO CONTINUE
              </DialogTitle>
              <div className='text-gray-700 text-sm font-semibold font-body leading-[21px] text-center'>
                Please login/signup to start the quiz
              </div>
              <Button
                className='w-16 h-8 px-4 mx-auto text-xs md:text-sm bg-[#919df483] hover:bg-[#919CF459]'
                variant={"secondary"}
                onClick={async () => {
                  await login();
                  router.push("/");
                }}
              >
                Login
              </Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}
