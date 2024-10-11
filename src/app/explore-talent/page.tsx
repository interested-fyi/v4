// app/talent/ExploreTalentPage.tsx
import React from "react";
import TalentFilter from "@/components/composed/talent/TalentFilter";
import TalentGrid from "@/components/composed/talent/TalentGrid";

export default function ExploreTalentPage() {
  return (
    <div className='flex flex-col gap-0'>
      <PageHeader />
      <div className='lg:px-16 sm:px-32 md:px-20 xl:px-32 bg-[#e1effe]'>
        <TalentFilter />
        <TalentGrid />
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className='w-full h-[152px] px-9 bg-[#2640eb] justify-center items-center inline-flex'>
      <div className='grow shrink basis-0 self-stretch flex-col justify-start items-center gap-6 inline-flex'>
        <div className='self-stretch text-center m-auto'>
          <span className='text-[#919cf4] text-4xl font-bold font-heading leading-9'>
            FIND{" "}
          </span>
          <span className='text-white text-4xl font-bold font-heading leading-9'>
            TALENT
          </span>
        </div>
      </div>
    </div>
  );
}
