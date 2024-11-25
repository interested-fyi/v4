"use client";

import { fetchUserFarcasterActivity } from "@/lib/api/helpers";
import {
  UserCombinedProfile,
  WarpcastResponseObject,
} from "@/types/return_types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ActivityCard from "./ActivityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyActivityFeedComponent } from "./EmptyActivityFeed";

const WarpcastActivityTab = ({
  userProfileData,
}: {
  userProfileData:
    | { profile: UserCombinedProfile; success: boolean }
    | undefined;
}) => {
  const {
    data: warpcastActivity,
    isLoading: warpcastActivityLoading,
    isError: warpCastError,
  } = useQuery({
    queryKey: ["warpcastActivity", userProfileData?.profile?.farcaster_fid],
    queryFn: async () => {
      return fetchUserFarcasterActivity({
        fid: `${userProfileData?.profile?.farcaster_fid}`,
      });
    },
  });
  if (warpcastActivityLoading) {
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

  if (!warpcastActivity || warpCastError) {
    return <EmptyActivityFeedComponent />;
  }

  return (
    <div className='flex flex-col gap-4'>
      {warpcastActivity?.messages?.map(
        (activity: WarpcastResponseObject, index: number) => (
          <ActivityCard
            key={index}
            message={activity}
            userProfileData={userProfileData}
          />
        )
      )}
    </div>
  );
};

export default WarpcastActivityTab;
