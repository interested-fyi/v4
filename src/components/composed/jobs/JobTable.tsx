// components/JobList.tsx
"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import JobPosting from "@/types/job-posting";
import { JobRow } from "./JobRow";
import { CompanyResponse } from "@/app/api/companies/get-approved-companies/route";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobTable = () => {
  const { getAccessToken } = usePrivy();
  const slug = useParams();
  const [activeJobFilter, setActiveJobFilter] = useState("true");
  const { data: company } = useQuery({
    queryKey: ["company-by-id"],
    enabled: typeof window !== "undefined",
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `/api/companies/get-company-by-id?companyId=${slug["company-id"]}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return (await res.json()) as {
        success: boolean;
        company: CompanyResponse;
      };
    },
  });
  const {
    data: jobs,
    isLoading: isLoadingJobs,
    isRefetching,
  } = useQuery({
    queryKey: ["jobs", activeJobFilter],
    enabled: typeof window !== "undefined",
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `/api/jobs/get-jobs-by-company?companyId=${slug["company-id"]}&active=${activeJobFilter}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return (await res.json()) as {
        success: boolean;
        jobs: JobPosting[];
      };
    },
  });

  if (isLoadingJobs || isRefetching) {
    return (
      // Loading state
      <div className='text-center min-h-96 flex justify-center items-center'>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className='w-[1200px] max-w-full mx-auto flex flex-col gap-8'>
      <Select onValueChange={(value) => setActiveJobFilter(value)}>
        <SelectTrigger className='w-[180px] mb-2 text-black placeholder:text-gray-700'>
          <SelectValue
            className='text-black placeholder:text-black'
            placeholder={"Select job status"}
          />
        </SelectTrigger>
        <SelectContent className='text-body text-black'>
          <SelectItem className='text-black' value={"true"}>
            Active
          </SelectItem>
          <SelectItem className='text-black' value={"false"}>
            Inactive
          </SelectItem>
        </SelectContent>
      </Select>

      <Table className='w-[1200px] max-w-full mx-auto'>
        <TableHeader>
          <TableRow className='font-heading text-[#4B5563] font-bold text-[16px] border-b-0'>
            <TableHead className=''>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className='text-right'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='font-body'>
          {jobs?.jobs?.map((job, index) => (
            <JobRow
              key={index}
              index={index}
              job={job}
              company={{
                name: company?.company?.name ?? "",
                id: (company?.company?.id as number) ?? 0,
              }}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobTable;
