"use client";
import clsx from "clsx";
import React, { useState } from "react";
import CandidateSignUpForm from "../forms/CandidateSignUpForm";
import CompanySignUpForm from "../forms/CompanySignUpForm";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { Separator } from "../ui/separator";
export function SignupForms() {
  const [formType, setFormType] = useState<"candidate" | "company" | null>(
    null
  );
  const { login, authenticated } = usePrivy();

  const handleClick = (value: "candidate" | "company" | null) => {
    if (!authenticated) {
      login();
      return;
    }
    setFormType(value);

    const formSection = document.getElementById("formSection");
    if (formSection) {
      setTimeout(() => {
        formSection.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };
  return (
    <>
      <div className='flex flex-col gap-12'>
        <div className='flex justify-between gap-2 max-w-full w-96 relative z-50'>
          <Button
            onClick={() => handleClick("candidate")}
            className={clsx(
              "rounded-lg shadow-lg mt-8 py-8 w-[194px] max-w-full flex flex-col items-center justify-center text-[#2640EB] text-[16px] font-[500] bg-[#E8FC6C] "
            )}
          >
            Find a job
          </Button>
          <Button
            onClick={() => handleClick("company")}
            className={clsx(
              "rounded-xl shadow-lg border border-[#E8FC6C] text-[#E8FC6C] bg-transparent mt-8 py-8 w-[194px] max-w-full flex flex-col items-center justify-center"
            )}
          >
            Post a job
          </Button>
        </div>
        {/* <Button
          onClick={() => {}}
          className={clsx(
            "rounded-lg shadow-lg mt-8 py-8 w-[123px] flex flex-col items-center justify-center text-[#2640EB] text-[16px] font-[500] bg-[#E8FC6C] "
          )}
        >
          Refer
        </Button> */}
        {authenticated ? (
          <section className='flex flex-col gap-12 relative z-50'>
            {formType !== null ? <Separator /> : null}
            {formType === "candidate" && (
              <div>
                <CandidateSignUpForm />
              </div>
            )}
            {formType === "company" && (
              <div>
                <CompanySignUpForm />
              </div>
            )}
          </section>
        ) : null}
        <div id='formSection' className='h-0 w-0' />
      </div>
    </>
  );
}
