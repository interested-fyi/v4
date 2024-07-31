"use client";
import { ApprovalButtonGroup } from "@/components/composed/admin/jobs/ApprovalButtonGroup";
import { JobPostingCard } from "@/components/composed/admin/jobs/JobPostingCard";
import JobPosting from "@/types/job-posting";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function AdminDashboardJobs() {
  const { getAccessToken } = usePrivy();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");
  const url = searchParams.get("url");

  const { data, error } = useQuery({
    queryKey: ["scrape-jobs"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      console.log("🚀 ~ queryFn: ~ accessToken:", accessToken);
      const response = await fetch("/api/companies/scrape-jobs", {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "Content-Type": "application",
        },
        body: JSON.stringify({
          url: url,
          company_id: companyId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (error) {
    return (
      <div className='flex flex-col gap-8'>
        <div className='flex md:flex-row flex-col px-28 h-36 max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[rgba(145,156,244,0.20)] border border-r-0 border-l-0 border-[#2640EB]'>
          <div className='flex gap-4'>
            <h1 className='font-heading text-3xl'>Jobs</h1>
          </div>
        </div>
        <div>Error: {error.message}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex flex-col gap-8'>
        <div className='flex md:flex-row flex-col px-28 h-36 max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[rgba(145,156,244,0.20)] border border-r-0 border-l-0 border-[#2640EB]'>
          <div className='flex gap-4'>
            <h1 className='font-heading text-3xl'>Jobs</h1>
          </div>
        </div>
        <div>Loading...</div>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex md:flex-row flex-col px-28 h-36 max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[rgba(145,156,244,0.20)] border border-r-0 border-l-0 border-[#2640EB]'>
        <div className='flex gap-4'>
          <h1 className='font-heading text-3xl'>Jobs</h1>
        </div>
      </div>

      <div className='max-w-[950px] px-4 w-full mx-auto space-y-6 font-body'>
        {data.job_postings.length >= 0 ? (
          <>
            {companyId ? (
              <ApprovalButtonGroup companyId={parseInt(companyId)} jobs={data.job_postings} url={url}/>
            ) : null}
            {data.job_postings.map((job: JobPosting, index: number) => (
              <JobPostingCard key={job.id} job={job} />
            ))}
          </>
        ) : (
          <div>No jobs found</div>
        )}
      </div>
    </div>
  );
}
