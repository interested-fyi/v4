"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { SelectComposed } from "../inputs/SelectComposed";
import { fetchUserProfile } from "@/lib/api/helpers";
import { usePrivy } from "@privy-io/react-auth";
import { LoaderCircle } from "lucide-react";

export type SalaryFormData = {
  role: string;
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
    role: "",
    geography: "",
    code: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  const isReadyToSubmit = !!formData.role && !!formData.geography;

  const { data: jobSalaryOptions, isLoading: jobSalaryOptionsLoading } =
    useQuery({
      queryKey: ["job-salary-options"],
      queryFn: async () => {
        const res = await fetch(`/api/salary-range/details`, {
          method: "GET",

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
        role: userProfileData?.profile?.position?.[0] ?? "",
        geography: userProfileData?.profile?.geography ?? "",
      }));
    }
  }, [userProfileData]);

  return (
    <div className='w-full max-w-[686px] mx-auto h-full relative '>
      <Card className=' m-auto '>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 flex-wrap'>
            I&apos;m a{" "}
            {
              <Select
                value={formData.code}
                onValueChange={(value) => {
                  handleSelectChange("code", value);
                  handleSelectChange("role", value.split("-")[1]);
                }}
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
                  }) ?? <SelectItem value='Loading...'>Loading...</SelectItem>}
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
              className='w-fit mx-auto bg-blue-700 min-w-48'
              disabled={!isReadyToSubmit || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <LoaderCircle className='w-6 h-6 m-auto animate-spin' />
              ) : (
                <>
                  <SearchIcon className='mr-2 h-5 w-5' />
                  Find your salary range
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
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
