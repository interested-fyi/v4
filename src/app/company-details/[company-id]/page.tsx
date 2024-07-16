import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_COMPANY_DATA, MOCK_JOB_DATA } from "@/lib/mockData";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { JobRow } from "@/components/composed/jobs/JobRow";
import Link from "next/link";

export default function ExploreTalentPage() {
  const company = MOCK_COMPANY_DATA;
  const jobs = MOCK_JOB_DATA;
  return (
    <div className='flex flex-col gap-8'>
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
              <Image
                alt='company logo'
                width={122}
                height={122}
                className='w-[122px] h-[122px]'
                src={company.logo}
              />
              <div className='w-[630px] flex-col justify-center items-start gap-2 inline-flex'>
                <div className='text-blue-700 text-5xl font-bold font-heading leading-[72px]'>
                  {company.name}
                </div>
                <div className='self-stretch h-[65px] text-black text-sm font-normal font-body leading-[21px]'>
                  {company.description}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full h-full  py-4 bg-[#2640EB] justify-between items-center gap-8 inline-flex'>
          <div className='flex w-[1200px] max-w-full mx-auto justify-between items-center gap-8 flex-wrap px-4'>
            <div className='px-3 py-0.5 bg-yellow-200 rounded-md justify-center items-center flex'>
              <div className='text-center text-blue-700 text-sm md:text-base font-medium font-body leading-normal'>
                Layer 2
              </div>
            </div>
            <div className='flex gap-2 md:flex-row flex-col-reverse justify-between items-center'>
              <div className='justify-start items-center gap-2 flex'>
                <Image
                  src='/svg/location.svg'
                  alt='location'
                  width={20}
                  height={20}
                />
                <p className='text-center text-white text-sm md:text-base font-medium font-body leading-normal'>
                  New York, New York USA
                </p>
              </div>
              <div className='justify-start items-center gap-2 flex'>
                <div className='w-6 h-[20.36px] relative'></div>
                <Image src='/svg/team.svg' alt='team' width={20} height={20} />
                <p className='text-center text-white text-sm md:text-base font-medium font-body leading-normal'>
                  11-50 people
                </p>
              </div>
            </div>
            <div className='grow shrink basis-0 h-6 justify-end items-center gap-6 flex'>
              <div className='w-6 h-6 relative' />
              <div className='w-6 h-6 relative' />
              <div className='justify-start items-center gap-2 flex'>
                <div className='w-6 h-6 relative' />
                <div className='text-center text-white text-sm md:text-base font-medium font-body underline leading-normal'>
                  optimism.io
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Table className='w-[1200px] max-w-full mx-auto'>
        <TableHeader>
          <TableRow className='font-heading text-[#4B5563] font-bold text-[16px] border-b-0'>
            <TableHead className=''>Position</TableHead>
            <TableHead>Compensation</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Teammates</TableHead>
            <TableHead>Posted</TableHead>

            <TableHead className='text-right'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='font-body'>
          {jobs.map((job, index) => (
            <JobRow key={index} index={index} job={job} company={company} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
