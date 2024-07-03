import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// a mock list of users for the table

const users = [
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
  {
    name: "Jeremy Perrier",
    role: "Product Designer",
    availability: "AVAILABLE FOR HIRE",
    work: "Part-time work, bug bounties",
    interests: ["Demo", "blockchain", "DAOs"],
  },
];

export default function ExploreTalentPage() {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex md:flex-row flex-col px-28 h-48 max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[rgba(145,156,244,0.20)] border border-r-0 border-l-0 border-[#2640EB]'>
        <div className='flex gap-4'>
          <Button
            className='bg-[#2640EB] uppercase font-heading border-2 border-[#2640EB] max-w-full w-[200px] text-[#E8FC6C] hover:border-[#D3D8FB] hover:border-2 '
            size='lg'
          >
            talent
          </Button>
          <Button
            className='text-[#919CF4] uppercase font-heading max-w-full w-[200px] bg-[#fff] border-2 border-[#D3D8FB]'
            size='lg'
          >
            interest
          </Button>
        </div>
        <div>
          <Input />
        </div>
      </div>
      <Table className='w-[1200px] max-w-full mx-auto'>
        <TableHeader>
          <TableRow className='font-heading text-[#4B5563] font-bold text-[16px] border-b-0'>
            <TableHead className=''>User</TableHead>
            <TableHead>Work search & availability</TableHead>
            <TableHead>Interests</TableHead>
            <TableHead className='text-right'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='font-body'>
          {users.map((user, index) => (
            <TableRow key={index} className='py-3 items-center'>
              <TableCell className='font-medium'>
                <div className='flex justify-start items-center gap-4'>
                  <Avatar>
                    <AvatarImage src='https://randomuser.me/api/port' />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col gap-1'>
                    <span>{user.name}</span>
                    <span className='text-muted-foreground'>{user.role}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex justify-center flex-col items-start gap-2'>
                  <div className='flex items-center gap-2'>
                    <Image
                      alt='checkmark'
                      src='/check.svg'
                      width={12}
                      height={12}
                    />
                    <p>{user.availability}</p>
                  </div>
                  <p>{user.work}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex md:flex-row flex-col gap-2'>
                  {user.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      className='gap-2 rounded-sm border border-[#919CF4] bg-[rgba(145,156,244,0.20)] text-[#5063EF] hover:bg-[rgba(145,156,244,.4)] font-body font-medium '
                    >
                      <Image src='/amm.svg' alt='amm' height={12} width={12} />{" "}
                      {interest}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className='text-right'>
                <Button variant={"outline"}>View Profile</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
