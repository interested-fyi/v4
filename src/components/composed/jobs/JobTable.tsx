// components/JobList.tsx
"use client";
import React from "react";
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

const JobTable = () => {
  const { getAccessToken } = usePrivy();
  const slug = useParams();

  const { data: company } = useQuery({
    queryKey: ["company-by-id"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `/api/companies/get-company-by-id?companyId=${slug["company-id"]}`,
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
        company: CompanyResponse;
      };
    },
  });

  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `/api/jobs/get-jobs-by-company?companyId=${slug["company-id"]}`,
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
      };
    },
  });

  if (isLoadingJobs) {
    return (
      // Loading state
      <div className='text-center'>Loading...</div>
    );
  }

  return (
    <Table className='w-[1200px] max-w-full mx-auto'>
      <TableHeader>
        <TableRow className='font-heading text-[#4B5563] font-bold text-[16px] border-b-0'>
          <TableHead className=''>Position</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Date Posted</TableHead>
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
  );
};

export default JobTable;
