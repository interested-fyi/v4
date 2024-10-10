// components/composed/talent/TalentFilter.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TalentFilter() {
  return (
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
  );
}
