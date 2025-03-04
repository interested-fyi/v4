"use client";
import { useEffect, useRef, useState } from "react";
import { CompanyCard } from "@/components/composed/companies/CompanyCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { JobPostingList } from "@/components/JobPostingList";
import { CompanyResponse } from "@/app/api/companies/get-approved-companies/route";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { StatItem, StatType } from "../StatsBanner";

export default function Explore() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL params or defaults
  const [activeButton, setActiveButton] = useState(
    searchParams.get("view") || "companies"
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 20);

  // Update URL when parameters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    params.set("view", activeButton);

    // Replace current URL with new params
    window.history.pushState({}, "", `${window.location.pathname}?${params}`);
  }, [page, limit, activeButton, router]);

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
    setPage(1); // Reset page when switching views
  };

  // Listen for popstate (back/forward navigation)
  useEffect(() => {
    const handleRouteChange = () => {
      const params = new URLSearchParams(window.location.search);
      setPage(Number(params.get("page")) || 1);
      setLimit(Number(params.get("limit")) || 20);
      setActiveButton(params.get("view") || "companies");
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);
  return (
    <>
      <div className='flex flex-col px-4 md:px-28 h-fit py-6 max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[#e1effe]'>
        <div className='flex flex-col w-full m-auto gap-8 items-start'>
          <Selector
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
          />
        </div>
      </div>
      {activeButton === "companies" ? (
        <StatItem type={StatType.Companies} />
      ) : (
        <StatItem type={StatType.Jobs} />
      )}
      {activeButton === "companies" ? <Companies /> : <Jobs />}
    </>
  );
}

interface SelectorProps {
  activeButton: string;
  handleButtonClick: (button: string) => void;
}
function Selector({ activeButton, handleButtonClick }: SelectorProps) {
  return (
    <div className='flex gap-4 relative mx-auto'>
      <Button
        size='lg'
        className={`w-40 md:w-52 max-w-full rounded-[8px] font-heading uppercase justify-start ${
          activeButton === "companies"
            ? "bg-[#2640EB] hover:bg-blue-600 hover:text-[#e7fb6c] text-[#e7fb6c] font-bold"
            : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4] font-normal"
        }`}
        onClick={() => handleButtonClick("companies")}
      >
        companies
      </Button>

      <Button
        size='icon'
        onClick={() =>
          activeButton === "jobs"
            ? handleButtonClick("companies")
            : handleButtonClick("jobs")
        }
        className='w-9 h-9 bg-transparent hover:bg-transparent active:scale-95 transition-all duration-100 absolute right-[45%] md:right-[46%]'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-9 h-9'
          id='switch'
          width={36}
          height={37}
          viewBox='0 0 36 37'
          fill='none'
        >
          <rect x='1' y='1.5' width='34' height='34' rx='17' fill='white' />
          <rect
            x='1'
            y='1.5'
            width='34'
            height='34'
            rx='17'
            stroke='#2640EB'
            strokeWidth='2'
          />
          <path
            d='M23.7826 21.6874L9.90039 21.6874L9.90039 22.9623L23.7826 22.9623L21.0512 25.6994L21.9537 26.6L26.2199 22.3248L21.9537 18.0497L21.0512 18.9503L23.7826 21.6874Z'
            fill='#2640EB'
          />
          <path
            d='M14.1664 10.4L9.90015 14.6751L14.1664 18.9503L15.0689 18.0497L12.3375 15.3126L26.2197 15.3126L26.2197 14.0377L12.3375 14.0377L15.0689 11.3006L14.1664 10.4Z'
            fill='#2640EB'
          />
        </svg>
      </Button>
      <Button
        size='lg'
        className={`w-40 md:w-52 rounded-[8px] font-heading uppercase justify-start ${
          activeButton === "jobs"
            ? "bg-[#2640EB] text-[#e7fb6c] hover:bg-blue-600 hover:text-[#e7fb6c] font-bold"
            : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4] font-normal"
        }`}
        onClick={() => handleButtonClick("jobs")}
      >
        jobs
      </Button>
    </div>
  );
}
interface CompaniesProps {
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Companies() {
  const { getAccessToken } = usePrivy();
  const observerRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingCompanies,
  } = useInfiniteQuery({
    queryKey: ["companies"],
    queryFn: async ({ pageParam = 1 }) => {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `/api/companies/get-approved-companies?page=${pageParam}&limit=20`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },

    initialPageParam: 1,
  });

  // Intersection Observer to detect scrolling to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className='flex flex-col gap-8'>
      <section className='grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6'>
        {data?.pages.map((page) =>
          page.companies.map((company: CompanyResponse) => (
            <Link
              className='w-full'
              href={`/company-details/${company.id}`}
              key={company.id}
            >
              <CompanyCard company={company} />
            </Link>
          ))
        )}

        <div ref={observerRef} className='h-10' />
      </section>
      {(isFetchingNextPage || isLoadingCompanies) && (
        <div className='text-center w-full mx-auto min-h-96'>
          <LoaderCircle className='w-12 h-12 text-blue-500 animate-spin mx-auto' />
        </div>
      )}
    </div>
  );
}

interface JobsProps {
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Jobs() {
  const [filters, setFilters] = useState({
    department: "",
    location: "",
    title: "",
  });

  const { getAccessToken } = usePrivy();
  const observerRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingJobs,
  } = useInfiniteQuery({
    queryKey: ["jobs", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const accessToken = await getAccessToken();
      const query = new URLSearchParams();
      query.append("page", String(pageParam));
      query.append("limit", "20"); // Changed to match Companies component
      for (const key in filters) {
        if (filters[key as keyof typeof filters]) {
          query.append(key, filters[key as keyof typeof filters]);
        }
      }

      const res = await fetch(`/api/jobs/get-all-jobs?${query.toString()}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      });
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const { data: jobFilters, isLoading: isLoadingJobFilters } = useQuery({
    queryKey: ["job-filters"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(`/api/jobs/get-job-filters`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      });
      return (await res.json()) as {
        success: boolean;
        departments: string[];
        locations: string[];
        roleTitles: string[];
      };
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex lg:flex-row flex-col gap-4 justify-between items-start lg:items-center px-8 max-w-3xl'>
        <div className='flex items-center gap-2'>
          <label className='min-w-24 lg:min-w-12'>Department:</label>
          <select
            value={filters.department}
            onChange={(e) =>
              setFilters({ ...filters, department: e.target.value })
            }
            className='border p-1 rounded w-40'
          >
            <option value=''>All Departments</option>
            {jobFilters?.departments?.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <label className='min-w-24 lg:min-w-12'>Location:</label>
          <select
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className='border p-1 rounded w-40'
          >
            <option value=''>All Locations</option>
            {jobFilters?.locations?.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <label className='min-w-24 lg:min-w-12'>Title:</label>
          <select
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            className='border p-1 rounded w-40'
          >
            <option value=''>All Titles</option>
            {jobFilters?.roleTitles?.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className='flex flex-col gap-6 p-4'>
        <JobPostingList jobs={data?.pages.flatMap((page) => page.jobs) ?? []} />
        <div ref={observerRef} className='h-10' />
      </section>
      {(isFetchingNextPage || isLoadingJobs) && (
        <div className='text-center w-full mx-auto min-h-96'>
          <LoaderCircle className='w-12 h-12 text-blue-500 animate-spin mx-auto' />
        </div>
      )}
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  return (
    <div className='flex justify-between items-center mt-4 max-w-96 pb-8 mx-auto'>
      <Button
        onClick={handlePreviousPage}
        disabled={page === 1}
        variant='outline'
      >
        Previous
      </Button>
      <span>
        Page{" "}
        <select
          value={page}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className='border p-1 rounded'
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <option key={pageNum} value={pageNum}>
                {pageNum}
              </option>
            )
          )}
        </select>{" "}
        of {totalPages}
      </span>
      <Button
        onClick={handleNextPage}
        disabled={page === totalPages}
        variant='outline'
      >
        Next
      </Button>
    </div>
  );
}
