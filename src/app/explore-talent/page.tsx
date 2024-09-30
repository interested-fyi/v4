import React from "react";
import { users } from "@/lib/constants";
import { UserCard } from "@/components/composed/talent/UserCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExploreTalentPage() {
  return (
    <div className='flex flex-col gap-0'>
      <div className='w-full h-[152px] px-9 bg-[#2640eb] justify-center items-center inline-flex'>
        <div className='grow shrink basis-0 self-stretch flex-col justify-start items-center gap-6 inline-flex'>
          <div className='self-stretch text-center m-auto'>
            <span className='text-[#919cf4] text-4xl font-bold font-heading leading-9'>
              FIND{" "}
            </span>
            <span className='text-white text-4xl font-bold font-heading leading-9'>
              TALENT
            </span>
          </div>
        </div>
      </div>
      <div className='lg:px-16 sm:px-32 md:px-20 xl:px-32 bg-[#e1effe]'>
        <div className='grow shrink basis-0 text-[#111928] text-sm font-medium font-body leading-[21px] py-[18px] bg-[#e1effe] px-3'>
          <Select>
            <SelectTrigger className='w-fit rounded-lg border border-gray-300 min-w-[352px] mx-auto md:mx-0'>
              <SelectValue placeholder='Filter Talent' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className='text-[#111928] text-sm font-medium font-body leading-[21px]'>
                  Filter by department
                </SelectLabel>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='engineering'>Engineering</SelectItem>
                <SelectItem value='design'>Design</SelectItem>
                <SelectItem value='marketing'>Marketing</SelectItem>
                <SelectItem value='sales'>Sales</SelectItem>
                <SelectItem value='finance'>Finance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='h-[34px] justify-end w-full items-center gap-4 inline-flex px-5 sm:px-12'>
          <div className='text-gray-600 text-sm font-medium font-body leading-[21px]'>
            Profiles per page:
          </div>
          <div className='w-fit bg-white rounded-lg justify-center items-center gap-2 flex'>
            <div className='text-[#111928] text-xs font-medium font-body leading-[18px]'>
              <Select>
                <SelectTrigger className='w-16 px-3'>
                  <SelectValue placeholder='20' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='10'>10</SelectItem>
                    <SelectItem value='20'>20</SelectItem>
                    <SelectItem value='30'>30</SelectItem>
                    <SelectItem value='40'>40</SelectItem>
                    <SelectItem value='50'>50</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className='bg-[#e1effe] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 p-4 '>
          {users.map((user, index) => (
            <UserCard key={user.name + index} />
          ))}
        </div>
      </div>
    </div>
  );
}
