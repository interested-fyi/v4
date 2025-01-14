"use client";

import React, { FormEvent } from "react";
import { SalaryRangeFinder, SalaryFormData } from "./SalaryRangeFinder";
import { SalaryRange } from "../../SalaryRange";
import SalaryQuizCopy from "./SalaryQuizCopy";

export function SalaryRangeComposed() {
  const [formData, setFormData] = React.useState<SalaryFormData>({
    category: "",
    role: "",
    seniority: "",
    geography: "",
  });
  const [salaryData, setSalaryData] = React.useState<{
    minSalary: string;
    medianSalary: string;
    maxSalary: string;
    currency: string;
  } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (formData: SalaryFormData) => {
    try {
      const response = await fetch(
        `/api/salary-range?country_code=${formData.geography}&job_profile=${formData.role}`,
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
      console.log("🚀 ~ handleSubmit ~ data:", data);
      setSalaryData({
        minSalary: data.salaryRange.new_min,
        medianSalary: data.salaryRange.new_mid,
        maxSalary: data.salaryRange.new_max,
        currency: data.salaryRange.currency,
      });
      setFormData(formData);

      scrollToTop();

      console.log("Form submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <>
      {formData.role && salaryData?.maxSalary ? (
        <SalaryRange
          role={formData.role}
          minSalary={salaryData.minSalary}
          medianSalary={salaryData.medianSalary}
          maxSalary={salaryData.maxSalary}
          currencyCode={salaryData.currency}
          location={formData.geography}
        />
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
