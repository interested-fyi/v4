"use client";
import CompanyRow from "@/components/composed/admin/company/CompanyRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export interface CompanyRowType {
  id: number;
  approved: boolean;
  careers_page_url: string;
  company_name: string;
  created_at: string;
  creator_email: string;
  creator_fid: number;
  creator_privy_did: string;
}

export default function AdminDashboard() {
  const { getAccessToken } = usePrivy();

  const { data, isLoading } = useQuery({
    queryKey: ["get-all-companies"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch("/api/companies/get-all-companies", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.json();
    },
  });
  if (isLoading) {
    return (
      <div className='flex flex-col gap-8'>
        <div className='flex md:flex-row flex-col px-28 h-36 max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[rgba(145,156,244,0.20)] border border-r-0 border-l-0 border-[#2640EB]'>
          <div className='flex gap-4'>
            <h1 className='font-heading'>Company approval dashboard</h1>
          </div>
        </div>
        <div className='w-fit mx-auto'>
          <h1 className='font-body mx-auto text-center'>Loading...</h1>
        </div>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex md:flex-row flex-col px-28 h-36 max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[rgba(145,156,244,0.20)] border border-r-0 border-l-0 border-[#2640EB]'>
        <div className='flex gap-4'>
          <h1 className='font-heading'>Company approval dashboard</h1>
        </div>
      </div>
      <Table className='w-[1150px] max-w-full mx-auto'>
        <TableHeader>
          <TableRow className='font-heading text-[#4B5563] font-bold text-[16px] border-b-0'>
            <TableHead className=''>Company Name</TableHead>
            <TableHead>Company Careers Page</TableHead>
            <TableHead>Company Email</TableHead>

            <TableHead className='text-right'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='font-body'>
          {data &&
            data.companies?.map((company: CompanyRowType, index: number) => (
              <CompanyRow key={index} index={index} company={company} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
