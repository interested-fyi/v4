"use client";

import React, { FormEvent } from "react";
import { SalaryRangeFinder, SalaryFormData } from "./SalaryRangeFinder";
import { SalaryRange } from "../../SalaryRange";
import SalaryQuizCopy from "./SalaryQuizCopy";
import Image from "next/image";

export function SalaryRangeComposed() {
  const [formData, setFormData] = React.useState<SalaryFormData>({
    category: "",
    role: "",
    seniority: "",
    geography: "",
    code: "",
  });
  const [salaryData, setSalaryData] = React.useState<
    | {
        minSalary: string;
        medianSalary: string;
        maxSalary: string;
        currency: string;
        level: number;
        jobProfile: string;
      }[]
    | null
  >(null);
  console.log("🚀 ~ SalaryRangeComposed ~ salaryData:", salaryData);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (formData: SalaryFormData) => {
    try {
      const response = await fetch(
        `/api/salary-range?country_code=${formData.geography}&job_code=${
          formData.code.split("-")[0]
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSalaryData(
        data.salaryRange.map(
          (d: {
            new_min: string;
            new_mid: string;
            new_max: string;
            currency: string;
            level: string;
            job_profile: string;
          }) => ({
            minSalary: d.new_min,
            medianSalary: d.new_mid,
            maxSalary: d.new_max,
            currency: d.currency,
            level: d.level,
            jobProfile: d.job_profile,
          })
        )
      );
      setFormData(formData);

      scrollToTop();

      console.log("Form submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <>
      {formData.code && salaryData ? (
        <div className='flex flex-col items-center gap-4'>
          <div className='flex justify-center mb-4'>
            <Image
              src='/svg/happy-binocular.svg'
              alt='binoculars'
              height={20}
              width={20}
              className='w-20 h-20 text-[#6b6bff]'
            />
          </div>
          {salaryData.map((salary, index) => (
            <SalaryRange
              key={index}
              minSalary={salary.minSalary}
              medianSalary={salary.medianSalary}
              maxSalary={salary.maxSalary}
              location={formData.geography}
              role={salary.jobProfile}
              currencyCode={salary.currency}
            />
          ))}
        </div>
      ) : (
        <SalaryQuizCopy />
      )}
      <SalaryRangeFinder
        onSubmit={(formData: SalaryFormData) => {
          handleSubmit(formData);
        }}
      />
    </>
  );
}
