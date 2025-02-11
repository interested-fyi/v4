"use client";
import React, { useEffect, useRef, useState } from "react";
import TalentFilter from "@/components/composed/talent/TalentFilter";
import TalentGrid, { UserProps } from "@/components/composed/talent/TalentGrid";
import { fetchTalent } from "@/lib/api/helpers";
import { useInfiniteQuery } from "@tanstack/react-query";

// Define sort options
export type SortOption = {
  field: "created_at" | "attestation_count" | "position";
  direction: "asc" | "desc";
};

export default function ExploreTalentPage() {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<SortOption>({
    field: "created_at",
    direction: "desc",
  });
  const limit = 20;
  const observerElem = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["talent", filter, sort],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchTalent({ filter, limit, page: pageParam, sort }),
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
    retry: 1,
  });

  // Intersection Observer code remains the same
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    if (observerElem.current) observer.observe(observerElem.current);
    return () => {
      if (observerElem.current) observer.unobserve(observerElem.current);
    };
  }, [fetchNextPage, hasNextPage]);

  const handleSort = (field: SortOption["field"]) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <div className='flex flex-col gap-0'>
      <PageHeader />
      <div className='flex flex-col lg:px-16 sm:px-32 md:px-20 xl:px-32 bg-[#e1effe]'>
        <div className='flex justify-between items-center mb-4'>
          <TalentSortFilter
            onFilterChange={setFilter}
            filter={filter}
            onSortChange={handleSort}
            sort={sort}
          />
        </div>
        <TalentGrid
          data={{
            users: data?.pages?.flatMap((page) => page.users) as UserProps[],
          }}
          isLoading={isLoading}
          isError={isError}
          resetFilter={() => setFilter("")}
        />
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

import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, SlidersHorizontal } from "lucide-react";
import { JobSelect } from "@/components/composed/inputs/JobSelect";

interface TalentSortFilterProps {
  filter: string;
  sort: SortOption;
  onFilterChange: (value: string) => void;
  onSortChange: (field: SortOption["field"]) => void;
}

function TalentSortFilter({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}: TalentSortFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (field: SortOption["field"]) => {
    onSortChange(field);
    setIsOpen(false);
  };

  const getSortLabel = (field: SortOption["field"]) => {
    switch (field) {
      case "created_at":
        return "Date";
      case "attestation_count":
        return "Attestations";
      case "position":
        return "Role";
      default:
        return "Sort";
    }
  };

  return (
    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
      <JobSelect
        value={filter}
        onValueChange={(val) => {
          onFilterChange(val);
        }}
      />
      <div className='relative' ref={dropdownRef}>
        <Button
          variant='outline'
          className='w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          onClick={() => setIsOpen(!isOpen)}
        >
          <SlidersHorizontal className='h-4 w-4 mr-2' />
          <span className='flex-grow text-left'>
            {getSortLabel(sort.field)}
          </span>
          {sort.direction === "desc" ? (
            <ArrowDownIcon className='h-4 w-4 ml-2' />
          ) : (
            <ArrowUpIcon className='h-4 w-4 ml-2' />
          )}
        </Button>
        {isOpen && (
          <div className='absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg divide-y divide-gray-100'>
            {(["created_at", "attestation_count", "position"] as const).map(
              (field) => (
                <button
                  key={field}
                  className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center justify-between
                  ${
                    sort.field === field
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-50"
                      : "text-gray-700"
                  }`}
                  onClick={() => handleSort(field)}
                >
                  <span>{getSortLabel(field)}</span>
                  {sort.field === field &&
                    (sort.direction === "desc" ? (
                      <ArrowDownIcon className='h-4 w-4 ml-2' />
                    ) : (
                      <ArrowUpIcon className='h-4 w-4 ml-2' />
                    ))}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
