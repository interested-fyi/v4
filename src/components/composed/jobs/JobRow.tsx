import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import { InterestedButton } from "../buttons/InterestedButton";

interface Job {
  position: string;
  compensation: string;
  location: string;
  commitment: string;
  manager: string;
  teammates: string[];
  posted: string;
}

interface JobRowProps {
  index: number;
  job: Job;
}

export function JobRow({ index, job }: JobRowProps) {
  return (
    <TableRow key={index} className='py-3 items-center font-body'>
      <TableCell className='font-medium'>
        <div className='flex flex-col gap-1'>
          <span className='text-[#2640EB] text-base font-semibold '>
            {job.position}
          </span>
          <span className='text-muted-foreground'>{job.location}</span>
        </div>
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
          <Avatar key={index}>
            <AvatarImage src={job.manager} />
            <AvatarFallback>{job.position.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
      </TableCell>
      <TableCell>
        <div className='flex md:flex-row flex-col gap-[-8px]'>
          {job.teammates.map((teammate, jobIndex) => (
            <Avatar
              key={jobIndex}
              className={`border-2 border-white relative right-${jobIndex * 2}`}
            >
              <AvatarImage src={teammate} />
              <AvatarFallback>TM</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </TableCell>
      <TableCell className='text-left'>
        <span>{job.posted}</span>
      </TableCell>
      <TableCell className='text-right'>
        <InterestedButton />
      </TableCell>
    </TableRow>
  );
}
