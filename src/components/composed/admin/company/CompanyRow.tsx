"use client";
import { ApprovalButtonGroup } from "./../jobs/ApprovalButtonGroup";
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CompanyRowType } from "@/app/admin/dashboard/page";
import { usePrivy } from "@privy-io/react-auth";

interface CompanyRowProps {
  index: number;
  company: CompanyRowType;
}
export function CompanyRow({ index, company }: CompanyRowProps) {
  const { getAccessToken } = usePrivy();

  const handleRevoke = async () => {
    const accessToken = await getAccessToken();
    const result = await fetch(`/api/companies/revoke`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application",
      },
      body: JSON.stringify({ companyId: company.id }),
    });
    if (result.ok) {
      console.log("Company revoked");
    }
  };

  return (
    <TableRow key={index} className='py-3 items-center font-body'>
      <TableCell className='font-medium'>
        <Link
          href={`/admin/dashboard/companies/${company.id}?companyId=${company.id}&url=${company.careers_page_url}`}
          className='flex justify-start items-center gap-4'
        >
          <div className='flex flex-col gap-1'>
            <span className='font-heading'>{company.company_name}</span>
            <span className='text-muted-foreground'>
              {company.creator_email}
            </span>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <div className='flex justify-center flex-col items-start gap-2'>
          <Link href={company.careers_page_url} target='_blank'>
            {company.careers_page_url}
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <div className='flex justify-center flex-col items-start gap-2'>
          <Link target='_blank' href={`mailto:${company.creator_email}`}>
            {company.creator_email}
          </Link>
        </div>
      </TableCell>
      <TableCell className='md:space-x-2 lg:space-x-4 space-y-4'>
        {company.approved ? (
          <Button className='border-black border w-full' onClick={handleRevoke}>
            Revoke Approval
          </Button>
        ) : (
          <>
            {" "}
            <ApprovalButtonGroup companyId={company.id} jobs={null} url={company.careers_page_url} />
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

export default CompanyRow;
