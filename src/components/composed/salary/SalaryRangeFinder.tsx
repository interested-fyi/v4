"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import React, { FormEvent, useEffect, useState } from "react";
import { SelectComposed } from "../inputs/SelectComposed";
import { fetchUserProfile } from "@/lib/api/helpers";
import { usePrivy } from "@privy-io/react-auth";

export type SalaryFormData = {
  category: string;
  role: string;
  seniority: string;
  geography: string;
  code: string;
};
interface SalaryRangeFinderProps {
  onSubmit: (formData: SalaryFormData) => void;
  children?: React.ReactNode;
}
export function SalaryRangeFinder({
  onSubmit,
  children,
}: SalaryRangeFinderProps) {
  const [formData, setFormData] = useState<SalaryFormData>({
    category: "",
    role: "",
    seniority: "",
    geography: "",
    code: "",
  });

  const { user, getAccessToken } = usePrivy();

  const { data: userProfileData } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id.replace("did:privy:", "")],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return await fetchUserProfile({ userId: user?.id, accessToken });
    },
  });

  const handleSelectChange = (name: keyof SalaryFormData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isReadyToSubmit = formData.role && formData.geography;

  const { data: jobSalaryOptions, isLoading: jobSalaryOptionsLoading } =
    useQuery({
      queryKey: ["job-salary-options"],
      queryFn: async () => {
        const res = await fetch(`/api/salary-range/details`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
          },
        });
        return (await res.json()) as {
          success: boolean;
          salaryDetails: {
            roleTitles: {
              job_profile: string;
              job_code: string;
            }[];
            locations: string[];
          };
        };
      },
    });

  useEffect(() => {
    if (userProfileData) {
      setFormData((prevState) => ({
        ...prevState,
        role: userProfileData.profile.position?.[0] ?? "",
        geography: userProfileData.profile.geography ?? "",
      }));
    }
  }, [userProfileData]);

  return (
    <div className='w-full max-w-[686px] mx-auto h-full relative '>
      <form className='w-full' onSubmit={handleSubmit}>
        <Card className=' m-auto '>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 flex-wrap'>
              I&apos;m a{" "}
              {
                <Select
                  value={formData.code}
                  onValueChange={(value) => handleSelectChange("code", value)}
                >
                  <SelectTrigger
                    id='code'
                    aria-label='Role'
                    className='w-64 mx-2'
                  >
                    <SelectValue placeholder='Role' />
                  </SelectTrigger>
                  <SelectContent>
                    {jobSalaryOptions?.salaryDetails?.roleTitles.map((role) => {
                      return (
                        <SelectItem
                          key={`${role.job_code}-${role.job_profile}`}
                          value={role.job_code + "-" + role.job_profile}
                        >
                          {role.job_profile}
                        </SelectItem>
                      );
                    }) ?? (
                      <SelectItem value='Loading...'>Loading...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              }{" "}
              in{" "}
              {
                <div className='relative'>
                  <SelectComposed
                    className='w-64 mx-2'
                    value={formData.geography}
                    onValueChange={(value) =>
                      handleSelectChange("geography", value)
                    }
                    placeholder='Location'
                    options={jobSalaryOptions?.salaryDetails?.locations ?? []}
                  />
                </div>
              }
              <Button
                type='submit'
                className='w-full bg-blue-700'
                disabled={!isReadyToSubmit}
              >
                <SearchIcon className='mr-2 h-5 w-5' />
                Find your salary range
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </form>
    </div>
  );
}

function SearchIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.3-4.3' />
    </svg>
  );
}
