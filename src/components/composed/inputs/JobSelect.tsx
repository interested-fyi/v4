import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobPositions } from "@/lib/constants";
import React from "react";

interface JobSelectProps {
  onValueChange: (position: string) => void;
  value: string;
}

export function JobSelect({ onValueChange, value }: JobSelectProps) {
  return (
    <Select
      onValueChange={(val) => {
        onValueChange(val);
      }}
      value={value}
    >
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a position' />
      </SelectTrigger>
      <SelectContent className='relative z-50'>
        {jobPositions.map((position) =>
          Object.entries(position).map(([key, value]) => (
            <SelectGroup key={key}>
              <SelectLabel>{key}</SelectLabel>
              {value.map((item: string) => (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
