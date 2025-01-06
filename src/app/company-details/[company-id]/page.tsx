import CompanyInfo from "@/components/composed/companies/CompanyInfo";
import JobTable from "@/components/composed/jobs/JobTable";
import React from "react";

const ServerExploreTalentPage = () => {
  return (
    <div className='flex flex-col gap-8'>
      <CompanyInfo />
      <JobTable />
    </div>
  );
};

export default ServerExploreTalentPage;
