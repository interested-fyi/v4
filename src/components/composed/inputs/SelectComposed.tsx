import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobTypes } from "@/lib/constants";
import React from "react";

interface JobTypeSelectProps {
  onValueChange: (position: string) => void;
  value: string;
  placeholder: string;
}

export function SelectComposed({
  onValueChange,
  value,
  placeholder,
}: JobTypeSelectProps) {
  return (
    <Select
      onValueChange={(val) => {
        onValueChange(val);
      }}
      value={value}
    >
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className='relative z-50'>
        {jobTypes.map((type) => (
          <SelectItem value={type} key={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
