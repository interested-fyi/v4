// components/composed/talent/TalentFilter.tsx
"use client";

import { JobSelect } from "../inputs/JobSelect";

export default function TalentFilter({
  onValueChange,
  value,
}: {
  onValueChange: (val: string) => void;
  value: string;
}) {
  return (
    <div className='max-w-[348px] self-end items-end grow shrink basis-0 text-[#111928] text-sm font-medium font-body leading-[21px] py-[18px] bg-[#e1effe] px-3'>
      <JobSelect
        value={value}
        onValueChange={(val) => {
          onValueChange(val);
        }}
      />
    </div>
  );
}
