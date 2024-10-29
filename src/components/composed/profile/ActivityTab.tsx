"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchUserFarcasterActivity } from "@/lib/api/helpers";
import { Loader } from "lucide-react";
import {
  UserCombinedProfile,
  WarpcastResponseObject,
} from "@/types/return_types";
import ActivityCard from "./ActivityCard";
import { EmptyActivityFeedComponent } from "./EmptyActivityFeed";
export default function ActivityTab({
  userProfileData,
}: {
  userProfileData:
    | { success: boolean; profile: UserCombinedProfile }
    | undefined;
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
  if (warpcastActivityLoading) {
    return <Loader className='w-full animate-spin mt-6 text-blue-700' />;
  }

  if (warpCastError) {
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
}
