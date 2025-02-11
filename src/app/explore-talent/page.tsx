"use client";
import React, { useEffect, useRef, useState } from "react";
import TalentFilter from "@/components/composed/talent/TalentFilter";
import TalentGrid, { UserProps } from "@/components/composed/talent/TalentGrid";
import { fetchTalent } from "@/lib/api/helpers";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function ExploreTalentPage() {
  const [filter, setFilter] = useState("");
  const limit = 10; // fixed limit for infinite scroll
  const observerElem = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["talent", filter],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchTalent({ filter, limit, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
    retry: 1,
  });

  // Intersection Observer for infinite scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "20px", // Trigger 200px before element comes into view
        threshold: 0.1,
      }
    );

    if (observerElem.current) observer.observe(observerElem.current);
    // Cleanup observer on component unmount or when dependencies change
    return () => {
      if (observerElem.current) observer.unobserve(observerElem.current);
    };
  }, [fetchNextPage, hasNextPage]);
  return (
    <div className='flex flex-col gap-0'>
      <PageHeader />
      <div className='flex flex-col lg:px-16 sm:px-32 md:px-20 xl:px-32 bg-[#e1effe]'>
        <TalentFilter onValueChange={setFilter} value={filter} />
        <TalentGrid
          data={{
            users: data?.pages?.flatMap((page) => page.users) as UserProps[],
          }}
          isLoading={isLoading}
          isError={isError}
          resetFilter={() => setFilter("")}
        />
        {/* Loading indicator for infinite scroll */}
        <div
          ref={observerElem}
          className='w-full h-16 flex items-center justify-center text-gray-500'
        >
          {isFetchingNextPage && <p>Loading more talent...</p>}
        </div>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className='w-full h-[152px] px-9 bg-[#2640eb] justify-center items-center inline-flex'>
      <div className='grow shrink basis-0 self-stretch flex-col justify-start items-center gap-6 inline-flex'>
        <div className='self-stretch text-center m-auto'>
          <span className='text-[#919cf4] text-4xl font-bold font-heading leading-9'>
            FIND{" "}
          </span>
          <span className='text-white text-4xl font-bold font-heading leading-9'>
            TALENT
          </span>
        </div>
      </div>
    </div>
  );
}
