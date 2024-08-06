// components/CompanyInfo.tsx
"use client";
import React from "react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { CompanyResponse } from "@/app/api/companies/get-approved-companies/route";

const CompanyInfo = () => {
  const { getAccessToken } = usePrivy();
  const slug = useParams();

  const { data: company, isLoading: isLoadingCompany } = useQuery({
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

  if (isLoadingCompany) {
    return (
      <div>
        <div className='flex md:flex-row flex-col px-4  h-80  max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[rgba(145,156,244,0.20)] border border-r-0 border-l-0 border-[#2640EB]'>
          <div className='w-[1200px] mx-auto max-w-full h-[301px] px-4  pt-10 pb-[60px] bg-violet-100 flex-col justify-center items-start gap-8 inline-flex'>
            <Breadcrumb>
              <BreadcrumbItem className='self-stretch justify-start items-center gap-[1068px] inline-flex'>
                <BreadcrumbLink
                  asChild
                  className='rounded-lg justify-center items-center gap-2 flex'
                >
                  <Link href='/explore'>
                    <div className='w-4 h-4 relative'>
                      {" "}
                      <Image
                        src='/svg/arrow-left.svg'
                        alt='back'
                        width={16}
                        height={16}
                      />
                    </div>
                    <div className='text-center text-blue-700 text-sm md:text-base font-bold font-heading leading-normal'>
                      Back
                    </div>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className='self-stretch justify-start items-center gap-8 flex'>
              <div className='w-[630px] flex-col justify-center items-start gap-2 inline-flex'>
                <div className='text-blue-700 text-5xl font-bold font-heading leading-[72px]'>
                  Loading...
                </div>
                {/* <div className='self-stretch h-[65px] text-black text-sm font-normal font-body leading-[21px]'>
              {company.description}
            </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className='w-full h-full  py-4 bg-[#2640EB] justify-between items-center gap-8 inline-flex'>
          <div className='flex w-[1200px] max-w-full mx-auto justify-between items-center gap-8 flex-wrap px-4'>
            <div className='grow shrink basis-0 h-6 justify-end items-center gap-6 flex'>
              <div className='w-6 h-6 relative' />
              <div className='w-6 h-6 relative' />
              <div className='justify-start items-center gap-2 flex'>
                <div className='w-6 h-6 relative' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex md:flex-row flex-col px-4  h-80  max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[rgba(145,156,244,0.20)] border border-r-0 border-l-0 border-[#2640EB]'>
        <div className='w-[1200px] mx-auto max-w-full h-[301px] px-4  pt-10 pb-[60px] bg-violet-100 flex-col justify-center items-start gap-8 inline-flex'>
          <Breadcrumb>
            <BreadcrumbItem className='self-stretch justify-start items-center gap-[1068px] inline-flex'>
              <BreadcrumbLink
                asChild
                className='rounded-lg justify-center items-center gap-2 flex'
              >
                <Link href='/explore'>
                  <div className='w-4 h-4 relative'>
                    {" "}
                    <Image
                      src='/svg/arrow-left.svg'
                      alt='back'
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className='text-center text-blue-700 text-sm md:text-base font-bold font-heading leading-normal'>
                    Back
                  </div>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className='self-stretch justify-start items-center gap-8 flex'>
            <div className='w-[630px] flex-col justify-center items-start gap-2 inline-flex'>
              <div className='text-blue-700 text-5xl font-bold font-heading leading-[72px]'>
                {company?.company?.name}
              </div>
              {/* <div className='self-stretch h-[65px] text-black text-sm font-normal font-body leading-[21px]'>
                {company.description}
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-full  py-4 bg-[#2640EB] justify-between items-center gap-8 inline-flex'>
        <div className='flex w-[1200px] max-w-full mx-auto justify-between items-center gap-8 flex-wrap px-4'>
          <div className='grow shrink basis-0 h-6 justify-end items-center gap-6 flex'>
            <div className='w-6 h-6 relative' />
            <div className='w-6 h-6 relative' />
            <div className='justify-start items-center gap-2 flex'>
              <div className='w-6 h-6 relative' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
