"use client";
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CompanyRowType } from "@/app/admin/dashboard/page";

interface CompanyRowProps {
  index: number;
  company: CompanyRowType;
}
export function CompanyRow({ index, company }: CompanyRowProps) {
  const handleApproveCompany = async () => {
    const result = await fetch(`/api/companies/${company.id}`, {
      method: "POST",
      body: JSON.stringify({ approved: true }),
    });
    if (result.ok) {
      console.log("Company approved");
    }
  };
  const handleDenyCompany = async () => {
    const result = await fetch(`/api/companies/${company.id}`, {
      method: "POST",
      body: JSON.stringify({ approved: false }),
    });
    if (result.ok) {
      console.log("Company denied");
    }
  };

  const handleRevoke = async () => {
    const result = await fetch(`/api/companies/${company.id}`, {
      method: "POST",
      body: JSON.stringify({ approved: false }),
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
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

export default CompanyRow;
