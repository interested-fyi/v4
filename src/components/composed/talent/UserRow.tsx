import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
  role: string;
  availability: string;
  work: string;
  interests: string[];
}
interface UserRowProps {
  index: number;
  user: User;
}
export function UserRow({ index, user }: UserRowProps) {
  return (
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
            <Image alt='checkmark' src='/check.svg' width={12} height={12} />
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
  );
}
