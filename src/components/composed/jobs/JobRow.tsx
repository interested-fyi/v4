"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import { InterestedButton } from "../buttons/InterestedButton";
import { ProfileModal, TeamMember } from "@/components/profile-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export interface Job {
  id: string;
  position: string;
  compensation: string;
  location: string;
  commitment: string;
  manager: TeamMember;
  teammates: TeamMember[];
  posted: string;
}

interface JobRowProps {
  index: number;
  company: string;
  job: Job;
}

export function JobRow({ index, job, company }: JobRowProps) {
  const router = useRouter();
  const navigateToJobDetails = (job: Job) => {
    const flattenedJob = {
      ...job,
      manager: job.manager.name,
      teammates: "",
    };
    const queryParams = new URLSearchParams({ ...flattenedJob, company });
    router.push(`/job-details/${job.id}?${queryParams}`);
  };
  return (
    <TableRow key={index} className='py-3 items-center font-body'>
      <TableCell className='font-medium'>
        <Button
          variant={"link"}
          className='hover:no-underline text-left hover:cursor-pointer'
          onClick={() => navigateToJobDetails(job)}
        >
          <div className='flex flex-col gap-1'>
            <span className='text-[#2640EB] text-base font-semibold '>
              {job.position}
            </span>
            <span className='text-muted-foreground'>{job.location}</span>
          </div>
        </Button>
      </TableCell>
      <TableCell>
        <div className='flex justify-center flex-col items-start gap-2'>
          <div className='flex items-center gap-2 font-semibold'>
            <p>{job.compensation}</p>
          </div>
          <p>{job.commitment}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className='flex md:flex-row flex-col gap-2'>
          <ProfileModal
            teamMember={job.manager}
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
          {job.teammates.map((teammate: TeamMember, jobIndex) => (
            <ProfileModal
              teamMember={teammate}
              trigger={
                <Avatar
                  className={`border-2 hover:cursor-pointer border-white relative right-${
                    jobIndex * 2
                  }`}
                >
                  <AvatarImage src={teammate.name} />
                  <AvatarFallback>{teammate.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              }
              key={jobIndex}
            />
          ))}
        </div>
      </TableCell>
      <TableCell className='text-left'>
        <span>{job.posted}</span>
      </TableCell>
      <TableCell className='text-right float-end pr-0'>
        <InterestedButton />
      </TableCell>
    </TableRow>
  );
}
