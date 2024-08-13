"use client";
import { useState } from "react";
import { CompanyCard } from "@/components/composed/companies/CompanyCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { CompanyResponse } from "../api/companies/get-approved-companies/route";
import JobPosting from "@/types/job-posting";
import { JobPostingList } from "@/components/JobPostingList";

export default function ExplorePage() {
  const [activeButton, setActiveButton] = useState("companies");
  const { getAccessToken } = usePrivy();

  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/companies/get-approved-companies", {
        method: "GET",
        cache: 'no-store',
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      },);
      return (await res.json()) as {
        success: boolean;
        companies: CompanyResponse[];
      };
    },
  });
  console.log(`Companies: ${data}`)

  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/jobs/get-all-jobs", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      });
      return (await res.json()) as {
        success: boolean;
        jobs: JobPosting[];
      };
    },
  });

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  return (
    <>
      <div className='flex flex-col px-4 md:px-28 h-64 max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[#919CF4] border border-r-0 border-l-0 border-[#2640EB]'>
        <div className='flex flex-col w-full m-auto gap-8 items-start'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-white font-heading text-4xl font-bold'>
              FIND WHAT INTERESTS YOU.
            </h1>
            <p className='text-[#111928] font-body font-[600] w-[290px] max-w-full'>
              Explore companies and organizations hiring across the web3
              ecosystem.
            </p>
          </div>
          <Selector
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
          />
        </div>
      </div>
      {activeButton === "companies" ? (
        <section className='grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6'>
          {isLoading ? (
            <div className='text-center'>
              <p>Loading...</p>
            </div>
          ) : (
            data?.companies?.map((company: CompanyResponse) => (
              <Link
                className='w-full'
                href={`/company-details/${company.id}`}
                key={company.id}
              >
                <CompanyCard company={company} />
              </Link>
            ))
          )}
        </section>
      ) : (
        <JobPostingList jobs={jobs?.jobs ?? []} />
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
    <div className='flex gap-4 relative'>
      <Button
        size='lg'
        className={`w-40 md:w-52 max-w-full rounded-[8px] font-heading font-bold uppercase justify-start ${
          activeButton === "companies"
            ? "bg-[#2640EB] hover:bg-blue-600 hover:text-white text-white"
            : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
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
        className={`w-40 md:w-52 rounded-[8px] font-heading font-bold uppercase justify-start ${
          activeButton === "jobs"
            ? "bg-[#2640EB] text-white hover:bg-blue-600 hover:text-white"
            : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
        }`}
        onClick={() => handleButtonClick("jobs")}
      >
        jobs
      </Button>
    </div>
  );
}
