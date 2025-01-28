"use client";

import React, { useEffect, useState } from "react";
import { SalaryRangeFinder, SalaryFormData } from "./SalaryRangeFinder";
import { SalaryRange } from "../../SalaryRange";
import SalaryQuizCopy from "./SalaryQuizCopy";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SalaryRangeComposed() {
  const [formData, setFormData] = React.useState<SalaryFormData>({
    role: "",
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
  const [isSalaryRangeSelected, setIsSalaryRangeSelected] =
    React.useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedDeviation, setSelectedDeviation] = useState<string | null>(
    "0-5k"
  );
  const [isComplete, setIsComplete] = useState(false);

  const { user, getAccessToken, authenticated, ready } = usePrivy();
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (formData: SalaryFormData) => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`/api/salary-range`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          countryCode: formData.geography,
          jobCode: formData.code.split("-")[0],
          privy_did: user?.id,
        }),
      });

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
      posthog.capture("salary_range_selected", {
        geography: formData.geography,
        job_code: formData.code.split("-")[0],
        privy_did: user?.id,
      });
      console.log("Form submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleSendSalaryFeedback = async () => {
    if (!salaryData || !user?.id) return;

    try {
      setIsComplete(true);
      const accessToken = await getAccessToken();
      const res = await fetch("/api/salary-range/analytics/submit-feedback", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          deviation: selectedDeviation,
          code: formData.code.split("-")[0],
          level: salaryData[currentIndex].level,
          privy_did: user.id,
        }),
      });
      posthog.capture("salary_feedback_submitted", {
        deviation: selectedDeviation,
        privy_did: user.id,
        job_code: formData.code.split("-")[0],
        level: salaryData[currentIndex].level,
      });
      if (!res.ok) {
        setIsComplete(false);
        throw new Error("Network response was not ok");
      }
      await completeTask(user.id, "salary_quiz");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setIsComplete(false);
    }
  };
  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      router.push("/?message=login");
    } else {
      posthog.identify(user?.id);
    }
  }, [authenticated, ready]);

  return (
    <div className='flex flex-col items-center gap-4'>
      {!salaryData ? <SalaryQuizCopy /> : null}
      <SalaryRangeFinder
        onSubmit={async (formData: SalaryFormData) => {
          await handleSubmit(formData);
        }}
      >
        {formData.code && salaryData ? (
          <div className='flex text-heading max-w-[415px] mx-auto flex-col items-center text-center md:items-start md:text-left'>
            <p className='text-gray-800'>
              Is this what you&apos;re looking for? If not, scroll through our
              other salaries and let us know how far off we were.
            </p>

            <div className='flex flex-row w-96 overflow-hidden'>
              <SalaryCarousel
                salaryData={salaryData}
                formData={formData}
                setCurrentIndex={setCurrentIndex}
                currentIndex={currentIndex}
                setIsSalaryRangeSelected={setIsSalaryRangeSelected}
              />
            </div>
            {isSalaryRangeSelected ? (
              <>
                <Card className='w-full max-w-md'>
                  <CardHeader>
                    <CardTitle className='text-xl font-semibold'>
                      How far off were we?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      defaultValue='0-5k'
                      onValueChange={setSelectedDeviation}
                    >
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
                <Button
                  className='w-full mt-4 bg-blue-700'
                  onClick={handleSendSalaryFeedback}
                >
                  Submit feedback
                </Button>
              </>
            ) : null}
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
        ) : null}
      </SalaryRangeFinder>
      <Dialog
        open={isComplete}
        onOpenChange={(open) => {
          !open && setIsComplete(false);
        }}
      >
        <DialogContent className='sm:max-w-[425px] bg-[#e1effe] font-body m-auto py-8'>
          <DialogHeader className='flex flex-col gap-3'>
            <DialogTitle className='text-2xl font-bold font-heading text-center mt-4'>
              Thank you for your feedback!
            </DialogTitle>
            <div className='text-gray-700 text-sm font-semibold font-body leading-[21px]'>
              Your feedback helps us improve our data and provide more accurate
              salary information.
            </div>
          </DialogHeader>

          <div className='flex flex-col items-center gap-0 mb-0 w-full'>
            <div className='mt-4 w-full'>
              <Button
                className='w-full bg-blue-700'
                onClick={() => setIsComplete(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MousePointerClickIcon,
} from "lucide-react";
import { USAGroupMap } from "../inputs/SelectComposed";

import { usePrivy } from "@privy-io/react-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import posthog from "posthog-js";
import { json } from "stream/consumers";
import { completeTask } from "@/lib/completeTask";

interface SalaryCarouselProps {
  salaryData: {
    minSalary: string;
    medianSalary: string;
    maxSalary: string;
    currency: string;
    level: number;
    jobProfile: string;
  }[];
  formData: SalaryFormData;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;

  setIsSalaryRangeSelected: React.Dispatch<React.SetStateAction<boolean>>;
}
const SalaryCarousel = ({
  salaryData,
  formData,
  currentIndex,
  setCurrentIndex,

  setIsSalaryRangeSelected,
}: SalaryCarouselProps) => {
  const { user } = usePrivy();
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? salaryData.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === salaryData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const [isHourly, setIsHourly] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendSalarySelection = async (salary: {
    minSalary: string;
    medianSalary: string;
    maxSalary: string;
    currency: string;
    level: number;
    jobProfile: string;
  }) => {
    setIsLoading(true);
    try {
      await posthog.capture("salary_level_selected", {
        level: salary.level,
        geography: formData.geography,
        job_code: formData.code.split("-")[0],
        privy_did: user?.id,
      });
      setIsSalaryRangeSelected(true);
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending salary selection:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className='relative w-full pb-8'>
      <div className='flex mb-4 text-heading min-w-[355px] max-w-full flex-col items-center text-center md:items-start md:text-left'>
        <div className='mt-2 w-full'>
          <p className='text-[#333333] text-left font-normal'>
            Base pay range for a{" "}
            <span className='font-semibold'>{formData.role}</span> living in{" "}
            <span className='font-semibold'>
              {USAGroupMap[formData.geography as keyof typeof USAGroupMap] ??
                formData.geography}
            </span>
          </p>
          <div className='flex items-center mt-2 space-x-4'>
            <div className='flex items-center'>
              <input
                type='radio'
                id='annual'
                name='pay'
                checked={!isHourly}
                onChange={() => setIsHourly(false)} // Update state to annual
              />
              <label htmlFor='annual' className='ml-2'>
                Annual salary
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='radio'
                id='hourly'
                name='pay'
                checked={isHourly}
                onChange={() => setIsHourly(true)} // Update state to hourly
              />
              <label htmlFor='hourly' className='ml-2'>
                Hourly rate
              </label>
            </div>
          </div>
        </div>
      </div>

      <div
        className='flex transition-transform duration-300 ease-in-out'
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {salaryData.map((salary, index) => (
          <div key={index} className='w-96 flex-shrink-0'>
            <SalaryRange
              minSalary={salary.minSalary}
              medianSalary={salary.medianSalary}
              maxSalary={salary.maxSalary}
              currencyCode={salary.currency}
              isHourly={isHourly}
              setIsHourly={setIsHourly}
            />
            <div className='flex w-full justify-center gap-4'>
              <AnimatedSuccessButton
                disabled={isLoading}
                onClick={() => handleSendSalarySelection(salary)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='flex items-center justify-around w-full px-4 z-10'>
        <button
          onClick={goToPrevious}
          className='p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors'
          aria-label='Previous salary range'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
        {/* Optional: Add dots indicator */}
        <div className='flex flex-col gap-1'>
          <div className='flex justify-center gap-2 mt-4'>
            {salaryData.map((_, index) => (
              <div
                key={_.jobProfile + index}
                className='flex items-center justify-center gap-2 flex-col'
              >
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentIndex === index ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  aria-label={`Go to salary range ${index + 1}`}
                />
                <p className='text-xs text-gray-500'>
                  L{salaryData[index].level}
                </p>
              </div>
            ))}
          </div>
          <p className='text-xs text-gray-500 text-center'>
            Which is the closest to your expectations/experience?
          </p>
        </div>
        <button
          onClick={goToNext}
          className='p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors'
          aria-label='Next salary range'
        >
          <ChevronRight className='w-6 h-6' />
        </button>
      </div>
    </div>
  );
};

export default SalaryCarousel;

interface AnimatedSuccessButtonProps {
  onClick: () => Promise<void>;
  className?: string;
  disabled: boolean;
}
const AnimatedSuccessButton = ({
  onClick,
  disabled,
  className = "",
}: AnimatedSuccessButtonProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    try {
      setIsAnimating(true);
      await onClick();
      setIsSuccess(true);

      // Reset after animation
      setTimeout(() => {
        setIsSuccess(false);
        setIsAnimating(false);
      }, 2000);
    } catch (error) {
      setIsAnimating(false);
      console.error("Error in button click:", error);
    }
  };

  return (
    <div className='flex mt-4 flex-col gap-2'>
      <span className='text-gray-500 text-xs'>
        Select your level to continue
      </span>
      <Button
        className={`
        mx-auto  
        relative 
        transition-all 
        duration-300 
        ${className}
        ${isSuccess ? "bg-green-600 scale-105" : "bg-blue-700"}
        ${isAnimating ? "pointer-events-none" : ""}
        overflow-hidden
      `}
        onClick={handleClick}
        disabled={isAnimating || disabled}
      >
        <span
          className={`
          flex items-center gap-2
          transition-transform duration-300
          ${isSuccess ? "transform -translate-y-10" : ""}
          `}
        >
          This is my level
          <MousePointerClickIcon />
        </span>

        <span
          className={`
        absolute inset-0
        flex items-center justify-center
        transition-transform duration-300
        ${isSuccess ? "transform translate-y-1" : "transform translate-y-10"}
      `}
        >
          <Check className='w-5 h-5 animate-bounce' />
        </span>
      </Button>
    </div>
  );
};
