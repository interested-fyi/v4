import { UserRow } from "./../../components/composed/talent/UserRow";
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { users } from "@/lib/constants";

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
            <UserRow key={index} index={index} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
