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
    location: "",
  });
  const [salaryData, setSalaryData] = React.useState<{
    minSalary: number;
    medianSalary: number;
    maxSalary: number;
  } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (formData: SalaryFormData) => {
    try {
      const response = await fetch("/api/salary-range", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSalaryData(data);
      setFormData(formData);

      scrollToTop();

      console.log("Form submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <>
      {formData.category && salaryData?.maxSalary ? (
        <SalaryRange
          role={formData.role}
          roleLevel={formData.seniority}
          minSalary={salaryData.minSalary}
          medianSalary={salaryData.medianSalary}
          maxSalary={salaryData.maxSalary}
          location={formData.location}
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
