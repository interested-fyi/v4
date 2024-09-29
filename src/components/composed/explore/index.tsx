"use client";
import { useState } from "react";
import { CompanyCard } from "@/components/composed/companies/CompanyCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import JobPosting from "@/types/job-posting";
import { JobPostingList } from "@/components/JobPostingList";
import { CompanyResponse } from "@/app/api/companies/get-approved-companies/route";
import { LoaderCircle } from "lucide-react";

export default function Explore() {
  const [activeButton, setActiveButton] = useState("companies");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
    setPage(1); // Reset page when switching
  };

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
        <Companies
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      ) : (
        <Jobs
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}
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
        className='bg-transparent hover:bg-transparent active:scale-95 transition-all duration-100 absolute right-[45%] md:right-[46%]'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='36'
          height='37'
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

export function Companies({
  page,
  limit,
  onPageChange,
  onLimitChange,
}: CompaniesProps) {
  const { getAccessToken } = usePrivy();

  const { data: companiesData, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies", page, limit],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `/api/companies/get-approved-companies?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return (await res.json()) as {
        success: boolean;
        companies: CompanyResponse[];
        totalCompanies: number;
        totalPages: number;
      };
    },
  });

  return (
    <>
      <div className='flex justify-end items-center gap-4 px-8'>
        <span>Companies per page:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className='border p-1 rounded'
        >
          {[10, 20, 50].map((limitOption) => (
            <option key={limitOption} value={limitOption}>
              {limitOption}
            </option>
          ))}
        </select>
      </div>

      {isLoadingCompanies ? (
        <div className='text-center flex items-center w-full min-h-60'>
          <LoaderCircle className='w-12 h-12 text-blue-500 animate-spin mx-auto' />
        </div>
      ) : (
        <section className='grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6 min-h-48'>
          {companiesData?.companies?.map((company: CompanyResponse) => (
            <Link
              className='w-full'
              href={`/company-details/${company.id}`}
              key={company.id}
            >
              <CompanyCard company={company} />
            </Link>
          ))}
        </section>
      )}

      <Pagination
        page={page}
        totalPages={companiesData?.totalPages ?? 1}
        onPageChange={onPageChange}
      />
    </>
  );
}

interface JobsProps {
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Jobs({ page, limit, onPageChange, onLimitChange }: JobsProps) {
  const { getAccessToken } = usePrivy();

  const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs", page, limit],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `/api/jobs/get-all-jobs?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return (await res.json()) as {
        success: boolean;
        jobs: JobPosting[];
        totalJobs: number;
        totalPages: number;
      };
    },
  });

  return (
    <>
      <div className='flex justify-end items-center gap-4 px-8'>
        <span>Jobs per page:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className='border p-1 rounded'
        >
          {[10, 20, 50].map((limitOption) => (
            <option key={limitOption} value={limitOption}>
              {limitOption}
            </option>
          ))}
        </select>
      </div>

      {isLoadingJobs ? (
        <div className='text-center flex items-center w-full min-h-60'>
          <LoaderCircle className='w-12 h-12 text-blue-500 animate-spin mx-auto' />
        </div>
      ) : (
        <JobPostingList jobs={jobsData?.jobs ?? []} />
      )}

      <Pagination
        page={page}
        totalPages={jobsData?.totalPages ?? 1}
        onPageChange={onPageChange}
      />
    </>
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
