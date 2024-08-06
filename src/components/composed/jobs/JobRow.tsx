"use client";
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { InterestedButton } from "../buttons/InterestedButton";
import JobPosting from "@/types/job-posting";
import Link from "next/link";

interface JobRowProps {
  index: number;
  job: JobPosting;
  company: { name: string; id: number };
}

export function JobRow({ index, job }: JobRowProps) {
  return (
    <TableRow key={index} className='py-3 items-center font-body'>
      <TableCell className='font-medium'>
        <div className='flex flex-col gap-1'>
          <span className='text-[#2640EB] text-base font-semibold '>
            {job.role_title}
          </span>
          <span className='text-muted-foreground'>{job.location}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className='flex justify-center flex-col items-start gap-2'>
          <div className='flex items-center gap-2 font-semibold'>
            <p>{job.type}</p>
          </div>
          <p>{job.department}</p>
        </div>
      </TableCell>
      {/* <TableCell>
        <div className='flex md:flex-row flex-col gap-2'>
          <ProfileModal
            teamMember={job.}
            trigger={
              <Avatar
                className={`border-2 hover:cursor-pointer border-white relative `}
              >
                <AvatarImage src={job.manager.imgSrc} />
                <AvatarFallback>{job.manager.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            }
          />
        </div>
      </TableCell>
      <TableCell>
        <div className='flex md:flex-row flex-col gap-[-8px]'>
          {job.teammates?.map((teammate: TeamMember, jobIndex) => (
            <ProfileModal
              teamMember={teammate}
              trigger={
                <Avatar
                  className={`border-2 hover:cursor-pointer border-white relative right-${
                    jobIndex * 2
                  }`}
                >
                  <AvatarImage src={teammate.imgSrc} />
                  <AvatarFallback>{teammate.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              }
              key={jobIndex}
            />
          ))}
        </div>
      </TableCell> */}
      <TableCell className='text-left'>
        <span>{new Date(job.created_at!).toLocaleDateString()}</span>
      </TableCell>
      <TableCell className='text-right float-end pr-0'>
        <Link href={job.posting_url}>
          <InterestedButton />
        </Link>
      </TableCell>
    </TableRow>
  );
}
