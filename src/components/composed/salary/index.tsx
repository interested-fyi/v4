"use client";

import React, { FormEvent } from "react";
import { SalaryRangeFinder, SalaryFormData } from "./SalaryRangeFinder";
import { SalaryRange } from "../../SalaryRange";
import SalaryQuizCopy from "./SalaryQuizCopy";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const [error, setError] = React.useState<string | null>(null);

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
        setError("No data found for the selected role and location");
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
      <SalaryRangeFinder
        onSubmit={(formData: SalaryFormData) => {
          handleSubmit(formData);
        }}
      >
        {formData.code && salaryData ? (
          <div className='flex text-heading max-w-[415px] mx-auto flex-col items-center text-center md:items-start md:text-left'>
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
            <form className='w-full'>
              <Card className='w-full max-w-md'>
                <CardHeader>
                  <CardTitle className='text-xl font-semibold'>
                    How far off were we?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue='0-5k'>
                    <div className='flex items-center space-x-2 mb-3'>
                      <RadioGroupItem value='correct' id='correct' />
                      <Label htmlFor='correct' className='text-sm'>
                        On the money
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2 mb-3'>
                      <RadioGroupItem value='0-5k' id='0-5k' />
                      <Label htmlFor='0-5k' className='text-sm'>
                        $0 - $5,000
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2 mb-3'>
                      <RadioGroupItem value='5-15k' id='5-15k' />
                      <Label htmlFor='5-15k' className='text-sm'>
                        $5,000 - $15,000
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2 mb-3'>
                      <RadioGroupItem value='15-50k' id='15-50k' />
                      <Label htmlFor='15-50k' className='text-sm'>
                        $15,000 - $50,000
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2 mb-3'>
                      <RadioGroupItem value='50-100k' id='50-100k' />
                      <Label htmlFor='50-100k' className='text-sm'>
                        $50,000 - $100,000
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='100k+' id='100k+' />
                      <Label htmlFor='100k+' className='text-sm'>
                        $100,000+
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              <Button className='w-full mt-4 bg-blue-700' type='submit'>
                Submit feedback
              </Button>
            </form>
          </div>
        ) : error ? (
          <div className='flex text-heading max-w-[415px] flex-col items-center text-center gap-4'>
            <Image
              src='/svg/binocular-question.svg'
              alt='binoculars'
              height={20}
              width={20}
              className='w-20 h-20 text-[#6b6bff]'
            />
            <h2 className='text-center text-red-500'>{error}</h2>
          </div>
        ) : (
          <SalaryQuizCopy />
        )}
      </SalaryRangeFinder>
    </>
  );
}
