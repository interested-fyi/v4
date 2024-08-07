import { SalaryRangeComposed } from "@/components/composed/salary";
import React from "react";

export default function SalaryQuizPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-[#f5f5ff] md:flex-row md:gap-20 overflow-hidden'>
      <SalaryRangeComposed />
    </div>
  );
}
