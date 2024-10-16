// components/composed/talent/TalentFilter.tsx
"use client";

import { JobSelect } from "../inputs/JobSelect";

export default function TalentFilter({
  onValueChange,
  value,
  limit,
  setLimit,
}: {
  onValueChange: (val: string) => void;
  value: string;
  limit: number;
  setLimit: (val: number) => void;
}) {
  return (
    <div className='max-w-[348px] self-end items-end grow shrink basis-0 text-[#111928] text-sm font-medium font-body leading-[21px] py-[18px] bg-[#e1effe] px-3'>
      <JobSelect
        value={value}
        onValueChange={(val) => {
          onValueChange(val);
        }}
      />
      <div className='flex justify-end items-center gap-4 mt-8'>
        <span>Profiles per page:</span>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className='border p-1 rounded'
        >
          {[10, 20, 50].map((limit) => (
            <option key={limit} value={limit}>
              {limit}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
