import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

interface JobTypeSelectProps {
  onValueChange: (position: string) => void;
  value: string;
  placeholder: string;
  options?: string[];
}

const USAGroupMap = {
  "USA - GROUP A": "USA - California",
  "USA - GROUP B": "USA - NY & Northeast, Washington",
  "USA - GROUP C": "USA - DC, Colorado, NC",
  "USA - GROUP D": "USA - Other states",
};

export function SelectComposed({
  onValueChange,
  value,
  placeholder,
  options,
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
        {options &&
          options?.map((type: string) => (
            <SelectItem value={type} key={type}>
              {USAGroupMap[type as keyof typeof USAGroupMap] ?? type}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
