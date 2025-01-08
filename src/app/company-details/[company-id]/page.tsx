"use client";

import CompanyInfo from "@/components/composed/companies/CompanyInfo";
import JobTable from "@/components/composed/jobs/JobTable";
import React, { useEffect, useState } from "react";

const ServerExploreTalentPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className='flex flex-col gap-8'>
      <CompanyInfo />
      <JobTable />
    </div>
  );
};

export default ServerExploreTalentPage;
