"use client";
import { useQuery } from "@tanstack/react-query";
import {
  fetchGitHubActivity,
  fetchUserFarcasterActivity,
} from "@/lib/api/helpers";
import { Loader } from "lucide-react";
import {
  UserCombinedProfile,
  WarpcastResponseObject,
} from "@/types/return_types";
import ActivityCard from "./ActivityCard";
import { EmptyActivityFeedComponent } from "./EmptyActivityFeed";
import GitHubActivityCard from "./GithubActivityCard";
import { SOCIALFEED } from "@/types/feeds";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityTab({
  userProfileData,
  activeFeed,
}: {
  userProfileData:
    | { success: boolean; profile: UserCombinedProfile }
    | undefined;
  activeFeed: SOCIALFEED;
}) {
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

  const { data, error, isLoading, isError } = useQuery({
    enabled: !!userProfileData?.profile?.github_username,
    queryKey: ["githubActivity", userProfileData?.profile?.github_username],
    queryFn: () => {
      return fetchGitHubActivity(
        userProfileData?.profile?.github_username || ""
      );
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

  if (!warpcastActivity && !GitHubActivityCard && !isLoading) {
    return <EmptyActivityFeedComponent />;
  }

  return (
    <div className='flex flex-col gap-4'>
      {activeFeed === SOCIALFEED.GITHUB &&
        data?.map((activity: any, index: number) => (
          <GitHubActivityCard key={index} event={activity} />
        ))}
      {activeFeed === SOCIALFEED.FARCASTER &&
        warpcastActivity?.messages?.map(
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
}
