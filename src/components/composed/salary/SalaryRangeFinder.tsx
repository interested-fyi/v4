"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { ChangeEvent, FormEvent, useState } from "react";

export interface SalaryFormData {
  category: string;
  role: string;
  seniority: string;
  location: string;
}
interface SalaryRangeFinderProps {
  onSubmit: (formData: SalaryFormData) => void;
}
export function SalaryRangeFinder({ onSubmit }: SalaryRangeFinderProps) {
  const [formData, setFormData] = useState<SalaryFormData>({
    category: "",
    role: "",
    seniority: "",
    location: "",
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

    try {
      const response = await fetch("https://mockapi.io/endpoint", {
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
      console.log("Form submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const isReadyToSubmit =
    formData.category &&
    formData.role &&
    formData.seniority &&
    formData.location;

  return (
    <div className='w-[517px] h-[600px] max-w-full md:h-[710px] relative bg-coins bg-no-repeat bg-center bg-cover transform rotate-[15deg]'>
      <form onSubmit={handleSubmit}>
        <Card className='absolute left-0 sm:left-12 md:left-8 top-20 md:top-40 w-full max-w-md mt-8 md:mt-0 transform rotate-[-15deg]'>
          <CardHeader>
            <CardTitle>Salary range finder</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id='category'>
                <SelectValue placeholder='Choose a category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='category1'>Category 1</SelectItem>
                <SelectItem value='category2'>Category 2</SelectItem>
                <SelectItem value='category3'>Category 3</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={formData.role}
              onValueChange={(value) => handleSelectChange("role", value)}
            >
              <SelectTrigger id='role' aria-label='Role'>
                <SelectValue placeholder='Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='role1'>Role 1</SelectItem>
                <SelectItem value='role2'>Role 2</SelectItem>
                <SelectItem value='role3'>Role 3</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={formData.seniority}
              onValueChange={(value) => handleSelectChange("seniority", value)}
            >
              <SelectTrigger id='seniority' aria-label='Seniority level'>
                <SelectValue placeholder='Seniority level' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='junior'>Junior</SelectItem>
                <SelectItem value='mid'>Mid</SelectItem>
                <SelectItem value='senior'>Senior</SelectItem>
              </SelectContent>
            </Select>
            <div className='relative'>
              <MapPinIcon className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
              <Input
                id='location'
                name='location'
                placeholder='Location'
                value={formData.location}
                onChange={handleChange}
                className='pl-10'
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

function MapPinIcon({ ...props }) {
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
      <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
      <circle cx='12' cy='10' r='3' />
    </svg>
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
