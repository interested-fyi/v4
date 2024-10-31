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
import { SOCIALFEED } from "@/app/profile/[privyDid]/page";

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
    return <Loader className='w-full animate-spin mt-6 text-blue-700' />;
  }

  if (warpCastError) {
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
