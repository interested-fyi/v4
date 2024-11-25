"use client";

import { fetchXTimeline } from "@/lib/api/helpers";
import { UserCombinedProfile } from "@/types/return_types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyActivityFeedComponent } from "./EmptyActivityFeed";
import TweetActivityCard, { Tweet } from "./TweetActivityCard";

const TwitterActivityTab = ({
  userProfileData,
}: {
  userProfileData:
    | { profile: UserCombinedProfile; success: boolean }
    | undefined;
}) => {
  const {
    data: twitterData,
    error: twitterError,
    isLoading: twitterLoading,
  } = useQuery({
    enabled: !!userProfileData?.profile?.x_username,
    queryKey: ["twitterActivity", userProfileData?.profile?.x_username],
    queryFn: () => {
      return fetchXTimeline(userProfileData?.profile?.x_username || "");
    },
    refetchOnReconnect: false,
    retry(failureCount, error) {
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchInterval: Infinity,
    retryDelay(failureCount, error) {
      return Math.min(1000 * 2 ** failureCount, 30000);
    },
  });

  if (twitterLoading && !twitterError) {
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

  if (!twitterData || twitterError) {
    return <EmptyActivityFeedComponent />;
  }

  return (
    <div className='flex flex-col gap-4'>
      {twitterData?.map((activity: Tweet, index: number) => (
        <TweetActivityCard
          key={index}
          tweet={activity}
          userProfileData={userProfileData}
        />
      ))}
    </div>
  );
};

export default TwitterActivityTab;
