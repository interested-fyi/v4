"use client";

import { UserCombinedProfile } from "@/types/return_types";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { EndorsementCard } from "./EndorementCard";
import { EmptyEndorsementsFeedComponent } from "./EmptyEndorsementsFeed";
import { Skeleton } from "@/components/ui/skeleton";
export default function EndorementsTab({
  userProfileData,
  privyDid,
}: {
  userProfileData:
    | {
        profile: UserCombinedProfile;
        success: boolean;
      }
    | undefined;
  privyDid: string;
}) {
  const { data: endorsements, isLoading: endorsementsLoading } = useQuery({
    enabled: true,
    queryKey: [
      "endorsements",
      privyDid.replace("did:privy:", ""),
      userProfileData?.profile?.smart_wallet_address,
    ],
    queryFn: async () => {
      if (!userProfileData?.profile?.smart_wallet_address) {
        return {
          success: false,
          endorsements: [],
        };
      }

      const res = await fetch(
        `/api/users/profiles/${privyDid.replace(
          "did:privy:",
          ""
        )}/get-endorsements?recipient_address=${
          userProfileData?.profile?.smart_wallet_address
        }`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const endorsementData = await res.json();
      return endorsementData as {
        success: boolean;
        endorsements: any[];
      };
    },
  });

  if (endorsementsLoading) {
    return (
      <div className='w-full flex flex-col min-h-96 items-center justify-center px-2'>
        {[1, 2, 3].map((endorsement) => (
          <div
            key={endorsement}
            className='w-full bg-gray-50 rounded-lg p-4 mb-4'
          >
            <div className='flex items-center mb-2'>
              <Skeleton className='w-12 h-12 rounded-full mr-4' />
              <div>
                <Skeleton className='h-4 w-24 mb-2' />
                <Skeleton className='h-3 w-32' />
              </div>
            </div>
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-full' />
          </div>
        ))}
      </div>
    );
  }

  if (!endorsements?.success || endorsements?.endorsements?.length === 0) {
    return <EmptyEndorsementsFeedComponent userProfileData={userProfileData} />;
  }

  return (
    <div className='flex flex-col gap-4'>
      {endorsements?.endorsements?.map((endorsement, index) => (
        <EndorsementCard key={index} {...endorsement} />
      ))}
    </div>
  );
}
