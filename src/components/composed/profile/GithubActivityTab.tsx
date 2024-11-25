"use client";

import { fetchGitHubActivity } from "@/lib/api/helpers";
import { UserCombinedProfile } from "@/types/return_types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyActivityFeedComponent } from "./EmptyActivityFeed";
import GitHubActivityCard from "./GithubActivityCard";

const GithubActivityTab = ({
  userProfileData,
}: {
  userProfileData:
    | { profile: UserCombinedProfile; success: boolean }
    | undefined;
}) => {
  const { data, isLoading, isError } = useQuery({
    enabled: !!userProfileData?.profile?.github_username,
    queryKey: ["githubActivity", userProfileData?.profile?.github_username],
    queryFn: () => {
      return fetchGitHubActivity(
        userProfileData?.profile?.github_username || ""
      );
    },
  });
  if (isLoading) {
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

  if (!data || isError) {
    return <EmptyActivityFeedComponent />;
  }

  return (
    <div className='flex flex-col gap-4'>
      {data?.map((activity: any, index: number) => (
        <GitHubActivityCard key={index} event={activity} />
      ))}
    </div>
  );
};

export default GithubActivityTab;
