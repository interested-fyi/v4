"use client";

import React from "react";
import { FormData, SalaryRangeFinder } from "./SalaryRangeFinder";
import { SalaryRange } from "../../SalaryRange";
import SalaryQuizCopy from "./SalaryQuizCopy";
export function SalaryRangeComposed() {
  const [formData, setFormData] = React.useState<FormData>({
    category: "",
    role: "",
    seniority: "",
    location: "",
  });
  const handleChange = (formData: FormData) => {
    setFormData(formData);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      {formData.category ? (
        <SalaryRange
          role={formData.role}
          roleLevel={formData.seniority}
          minSalary={100000}
          medianSalary={145000}
          maxSalary={200000}
          location={formData.location}
        />
      ) : (
        <SalaryQuizCopy />
      )}
      <SalaryRangeFinder
        onSubmit={(formData) => {
          handleChange(formData);
        }}
      />
    </>
  );
}
