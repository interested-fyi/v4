import { CompanyResponse } from "@/app/api/companies/get-approved-companies/route";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

interface CompanyCardProps {
  company: CompanyResponse;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className='relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 min-h-full'>
      <Link
        href={`/company-details/${company.id}`}
        className='absolute inset-0 z-10'
        prefetch={false}
      >
        <span className='sr-only'>View company</span>
      </Link>
      <CardContent className='p-6 flex-row flex justify-between items-center'>
        <CardTitle className='text-lg font-semibold'>{company.name}</CardTitle>

        <Badge
          className='rounded-[8px] border-[#919CF4] font-body text-[#2640EB]'
          variant={"outline"}
        >
          {company.jobCount} jobs available
        </Badge>
      </CardContent>
    </Card>
  );
}
