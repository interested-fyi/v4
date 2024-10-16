// components/composed/talent/TalentGrid.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { UserCard } from "@/components/composed/talent/UserCard";
import { fetchTalent } from "@/lib/api/helpers";
import { UserCombinedProfile } from "@/types/return_types";
import { Loader } from "lucide-react";

export interface UserProps extends UserCombinedProfile {
  attestation_count: number;
}

interface TalentGridProps {
  data: { users: UserProps[] } | undefined;
  isLoading: boolean;
  isError: boolean;
  resetFilter: () => void;
}

export default function TalentGrid({
  data,
  isLoading,
  isError,
  resetFilter,
}: TalentGridProps) {
  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center py-10 min-h-[65vh] text-center px-4'>
        <h2 className='text-2xl font-semibold text-red-600 mb-4'>
          No Talent Found
        </h2>
        <p className='text-md text-gray-600 mb-4'>
          We couldn't find any talent matching your criteria. Try adjusting the
          filter and search again.
        </p>
        <button
          onClick={() => resetFilter()}
          className='bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'
        >
          Reset Filters
        </button>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className='min-h-[65vh] flex flex-col justify-center items-center gap-2'>
        <Loader className='text-blue-700 animate-spin' />
        <p>Loading talent...</p>
      </div>
    );

  return (
    <div className='bg-[#e1effe] w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 p-4 min-h-screen grid-rows-4'>
      {data?.users.map((user: UserProps) => (
        <UserCard key={user.privy_did} user={user} />
      ))}
    </div>
  );
}
