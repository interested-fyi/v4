import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";

interface CompanyCardProps {
  company: {
    name: string;
    logo: string;
    description: string;
    badges?: string[];
  };
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className='relative min-h-full w-full sm:w-[252px] max-w-full rounded-[8px] border border-[#919CF4] bg-[#fff] shadow-md shadow-[0px 8px 14px 0px rgba(38, 64, 235, 0.10)]'>
      <div className='absolute top-[-38px] left-6'>
        <Image
          src={`/images/${company.logo}-logo.png`}
          width={80}
          height={80}
          alt={`${company.name} logo`}
        />
      </div>
      <CardContent className='p-6 pt-[58px] flex flex-col gap-2 justify-start items-start w-full'>
        <CardTitle className='text-[#111928] font-heading text-xl font-bold'>
          {company.name}
        </CardTitle>
        <CardDescription className='text-[#000] font-body text-sm font-[400]'>
          {company.description}
        </CardDescription>
        <CardFooter className='px-0 pb-0'>
          {company.badges
            ? company.badges.map((badge) => {
                return (
                  <Badge
                    key={badge}
                    className='rounded-[8px] border-[#919CF4] font-body text-[#2640EB]'
                    variant={"outline"}
                  >
                    {badge}
                  </Badge>
                );
              })
            : null}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
