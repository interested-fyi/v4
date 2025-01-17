import React from "react";
import { RateCalculator } from "./composed/salary/RateCalculator";
import { USAGroupMap } from "./composed/inputs/SelectComposed";

interface SalaryRangeProps {
  minSalary: string;
  medianSalary: string;
  maxSalary: string;
  currencyCode: string;
  isHourly?: boolean;
  setIsHourly: (isHourly: boolean) => void;
}

export function SalaryRange({
  minSalary,
  medianSalary,
  maxSalary,
  currencyCode,
  isHourly,
}: SalaryRangeProps) {
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
    <RateCalculator
      minSalary={rates.minSalary}
      maxSalary={rates.maxSalary}
      medianSalary={rates.medianSalary}
      currencyCode={currencyCode}
    />
  );
}
