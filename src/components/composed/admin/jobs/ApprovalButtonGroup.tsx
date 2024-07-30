import { Button } from "@/components/ui/button";
import React from "react";

interface ApprovalButtonGroupProps {
  companyId: number;
  jobs: string[];
}

export function ApprovalButtonGroup({
  companyId,
  jobs,
}: ApprovalButtonGroupProps) {
  const handleApproveCompany = async () => {
    const result = await fetch(`/api/companies/${companyId}`, {
      method: "POST",
      body: JSON.stringify({
        companyId: companyId,
        jobs: jobs ?? [],
        approved: true,
      }),
    });
    if (result.ok) {
      console.log("Company approved");
    }
  };
  const handleDenyCompany = async () => {
    const result = await fetch(`/api/companies/${companyId}`, {
      method: "POST",
      body: JSON.stringify({
        companyId: companyId,
        jobs: jobs ?? [],
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
