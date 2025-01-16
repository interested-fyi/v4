import React from "react";
import { RateCalculator } from "./composed/salary/RateCalculator";
import { USAGroupMap } from "./composed/inputs/SelectComposed";

interface SalaryRangeProps {
  location: string;
  minSalary: string;
  medianSalary: string;
  maxSalary: string;
  role: string;
  currencyCode: string;
}

export function SalaryRange({
  location,
  role,
  minSalary,
  medianSalary,
  maxSalary,
  currencyCode,
}: SalaryRangeProps) {
  const [isHourly, setIsHourly] = React.useState(false);
  const handleCalculateHourlyRate = () => {
    const hoursInYearOfWork = 2080;
    const minHourlyRate =
      Number(minSalary.replace(/,/g, "")) / hoursInYearOfWork;
    const medianHourlyRate =
      Number(medianSalary.replace(/,/g, "")) / hoursInYearOfWork;
    const maxHourlyRate =
      Number(maxSalary.replace(/,/g, "")) / hoursInYearOfWork;
    return {
      minSalary: minHourlyRate.toLocaleString(),
      medianSalary: medianHourlyRate.toLocaleString(),
      maxSalary: maxHourlyRate.toLocaleString(),
    };
  };

  const rates = isHourly
    ? handleCalculateHourlyRate()
    : { minSalary, medianSalary, maxSalary };

  return (
    <div className='flex text-heading w-[355px] max-w-full flex-col items-center text-center md:items-start md:text-left'>
      <p className='text-left text-[#333333] self-start'>
        For a <span className='font-semibold'>{role}</span> living in{" "}
        <span className='font-semibold'>
          {USAGroupMap[location as keyof typeof USAGroupMap] ?? location}
        </span>
        :
      </p>
      <div className='mt-6 w-full'>
        <p className='text-[#333333] text-left font-semibold'>
          Market pay range
        </p>
        <div className='flex items-center mt-2 space-x-4'>
          <div className='flex items-center'>
            <input
              type='radio'
              id='annual'
              name='pay'
              className=''
              onChange={() => setIsHourly(false)}
              defaultChecked
            />
            <label htmlFor='annual' className='ml-2 '>
              Annual salary
            </label>
          </div>
          <div className='flex items-center'>
            <input
              type='radio'
              id='hourly'
              name='pay'
              onChange={() => setIsHourly(true)}
              className='text-[#cccccc]'
            />
            <label htmlFor='hourly' className='ml-2 '>
              Hourly rate
            </label>
          </div>
        </div>
        <RateCalculator
          minSalary={rates.minSalary}
          maxSalary={rates.maxSalary}
          medianSalary={rates.medianSalary}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  );
}
