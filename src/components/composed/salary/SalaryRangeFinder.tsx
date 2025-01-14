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
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SelectComposed } from "../inputs/SelectComposed";
import { fetchUserProfile } from "@/lib/api/helpers";
import { usePrivy } from "@privy-io/react-auth";

export type SalaryFormData = {
  category: string;
  role: string;
  seniority: string;
  geography: string;
};
interface SalaryRangeFinderProps {
  onSubmit: (formData: SalaryFormData) => void;
}
export function SalaryRangeFinder({ onSubmit }: SalaryRangeFinderProps) {
  const [formData, setFormData] = useState<SalaryFormData>({
    category: "",
    role: "",
    seniority: "",
    geography: "",
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
            roleTitles: string[];
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
    <div className='w-[517px] h-[600px] max-w-full md:h-[710px] relative bg-coins bg-no-repeat bg-center bg-cover transform rotate-[15deg]'>
      <form onSubmit={handleSubmit}>
        <Card className='absolute -left-4 sm:left-12 md:left-8 top-20 md:top-40 w-full max-w-md mt-8 md:mt-0 transform rotate-[-15deg]'>
          <CardHeader>
            <CardTitle>Salary range finder</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Select
              value={formData.role}
              onValueChange={(value) => handleSelectChange("role", value)}
            >
              <SelectTrigger id='role' aria-label='Role'>
                <SelectValue placeholder='Role' />
              </SelectTrigger>
              <SelectContent>
                {jobSalaryOptions?.salaryDetails?.roleTitles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                )) ?? <SelectItem value='Loading...'>Loading...</SelectItem>}
              </SelectContent>
            </Select>

            <div className='relative'>
              <SelectComposed
                value={formData.geography}
                onValueChange={(value) =>
                  handleSelectChange("geography", value)
                }
                placeholder='Location'
                options={jobSalaryOptions?.salaryDetails?.locations ?? []}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type='submit'
              className='w-full bg-blue-700'
              disabled={!isReadyToSubmit}
            >
              <SearchIcon className='mr-2 h-5 w-5' />
              Find your salary range
            </Button>
          </CardFooter>
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
