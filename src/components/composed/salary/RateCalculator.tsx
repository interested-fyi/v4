import React from "react";
interface RateCalculatorProps {
  minSalary: number;
  medianSalary: number;
  maxSalary: number;
}
/**
 * Renders a rate calculator component.
 *
 * @component
 *
 * @param {number} minSalary - The minimum salary.
 * @param {number} medianSalary - The median salary.
 * @param {number} maxSalary - The maximum salary.
 * @returns {JSX.Element} The rendered RateCalculator component.
 */
export function RateCalculator({
  minSalary,
  medianSalary,
  maxSalary,
}: RateCalculatorProps) {
  return (
    <div className='mt-4 border border-blue-700 w-full rounded-lg'>
      <div className='flex justify-between p-4 border-b border-blue-700 w-full'>
        <span className='text-[#333333]'>Minimum</span>
        <span className='font-semibold text-[#0052cc]'>
          ${minSalary.toLocaleString()}
        </span>
      </div>
      <div className='flex justify-between p-4 border-b border-blue-700 w-full'>
        <span className='text-[#333333]'>Median</span>
        <span className='font-semibold text-[#0052cc]'>
          ${medianSalary.toLocaleString()}
        </span>
      </div>
      <div className='flex justify-between p-4'>
        <span className='text-[#333333]'>Maximum</span>
        <span className='font-semibold text-[#0052cc]'>
          ${maxSalary.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
