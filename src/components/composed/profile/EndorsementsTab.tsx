"use client";

import { UserCombinedProfile } from "@/types/return_types";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { EndorsementCard } from "./EndorementCard";
import { EmptyEndorsementsFeedComponent } from "./EmptyEndorsementsFeed";
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
          cache: "no-store",
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
    return <Loader className='w-full animate-spin mt-6 text-blue-700' />;
  }

  if (!endorsements?.success) {
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
