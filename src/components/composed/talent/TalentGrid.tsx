// components/composed/talent/TalentGrid.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { UserCard } from "@/components/composed/talent/UserCard";
import { fetchTalent } from "@/lib/api/helpers";
import { UserCombinedProfile } from "@/types/return_types";

export default function TalentGrid() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["talent"],
    queryFn: fetchTalent,
  });

  if (isLoading) return <p>Loading talent...</p>;
  if (isError) return <p>Error loading talent</p>;

  return (
    <div className='bg-[#e1effe] w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 p-4'>
      {data?.users.map((user: UserCombinedProfile) => (
        <UserCard key={user.privy_did} user={user} />
      ))}
    </div>
  );
}
