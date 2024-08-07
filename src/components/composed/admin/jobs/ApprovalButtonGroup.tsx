import { Button } from "@/components/ui/button";
import JobPosting from "@/types/job-posting";
import { usePrivy } from "@privy-io/react-auth";
import { User } from "@privy-io/server-auth";
import React from "react";

interface ApprovalButtonGroupProps {
  companyId: number;
  jobs: JobPosting[] | null;
  url: string | null;
}

export function ApprovalButtonGroup({
  companyId,
  jobs,
  url,
}: ApprovalButtonGroupProps) {
  const { getAccessToken } = usePrivy();

  const handleApproveCompany = async () => {  
    const accessToken = await getAccessToken();
    const result = await fetch(`/api/companies/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application",
      },
      body: JSON.stringify({
        companyId: companyId,
        jobs: jobs,
        url: url,
      }),
    });
    if (result.ok) {
      console.log("Company approved");
    }
  };
  const handleDenyCompany = async () => {
    const accessToken = await getAccessToken();
    const result = await fetch(`/api/companies/deny`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application",
      },
      body: JSON.stringify({
        companyId: companyId,
        jobs: jobs,
        approved: false,
      }),
    });
    if (result.ok) {
      console.log("Company denied");
    }
  };
  return (
    <div className='space-x-4 space-y-4'>
      {" "}
      <Button
        variant={"outline"}
        className='border-green-700 text-green-700 w-full md:w-[45.5%]'
        onClick={handleApproveCompany}
      >
        Approve
      </Button>
      <Button
        variant={"outline"}
        className='border-red-500 text-red-500 w-full md:w-[45.5%]'
        onClick={handleDenyCompany}
      >
        Deny
      </Button>
    </div>
  );
}
