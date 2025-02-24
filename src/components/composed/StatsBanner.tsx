"use client";

import type React from "react";
import { Users, Briefcase, Building, Sparkles } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
export enum StatType {
  Companies = "companies",
  Jobs = "jobs",
  Users = "users",
}
interface Stat {
  type: StatType;
}

interface Company {
  name: string;
  logo: string;
  url: string;
}

interface StatsBannerProps {
  recentCompanies: Company[];
}

export const iconComponents = {
  [StatType.Users]: Users,
  [StatType.Jobs]: Briefcase,
  [StatType.Companies]: Building,
};

export const StatItem: React.FC<Stat> = ({ type }) => {
  const IconComponent = iconComponents[type];
  const { data, error } = useQuery({
    queryKey: ["stats", "companies", type],
    queryFn: async () => {
      const res = await fetch(`/api/data/stats?type=${type}`, {
        method: "GET",
        cache: "no-store",
      });
      return await res.json();
    },
  });

  if (error) {
    return (
      <div className='flex flex-col items-center px-8 py-4 stat-item relative'>
        <div className='relative mb-2'>
          <div className='absolute inset-0 bg-white/10 rounded-full' />
          <IconComponent className='w-8 h-8 text-blue-700 relative z-10' />
        </div>
        <span className='text-4xl font-mono font-bold mb-1 text-blue-700'>
          Error
        </span>
        <span className='text-sm uppercase tracking-wider text-center text-blue-700/80 font-mono'>
          {error.message}
        </span>
      </div>
    );
  }
  if (!data) {
    return null;
  }

  return (
    <div className='flex flex-col items-center px-8 py-4 stat-item relative'>
      <div className='relative mb-2'>
        <div className='absolute inset-0 bg-white/10 rounded-full' />
        <IconComponent className='w-8 h-8 text-blue-700 relative z-10' />
      </div>
      <span className='text-4xl font-mono font-bold mb-1 text-blue-700'>
        {data.value}
      </span>
      <span className='text-sm uppercase tracking-wider text-center text-blue-700/80 font-mono'>
        {data.label}
      </span>
    </div>
  );
};

const CompanyItem: React.FC<Company> = ({ name, logo, url }) => (
  <Link
    href={url}
    target='_blank'
    className='flex flex-col items-center group hover:scale-105 transition-transform'
  >
    <div className='relative'>
      <div className='absolute -right-1'>
        <Sparkles className='w-4 h-4 text-yellow-300' />
      </div>
      <Image
        width={96}
        height={96}
        src={logo || "/placeholder.svg"}
        alt={`${name} logo`}
        className='min-w-24 w-24 min-h-24 h-24 rounded-full mb-2 bg-white/10 p-1'
      />
    </div>
  </Link>
);

const StatsBanner: React.FC<StatsBannerProps> = ({ recentCompanies }) => {
  return (
    <div className='relative w-full overflow-hidden bg-blue-700 py-2'>
      {/* Added marquee-container class for hover control */}
      <div className='inline-flex w-full marquee-container'>
        <div className='flex animate-marquee gap-12 whitespace-nowrap'>
          {recentCompanies.map((company, index) => (
            <CompanyItem key={`company-1-${index}`} {...company} />
          ))}
          {recentCompanies.map((company, index) => (
            <CompanyItem key={`company-2-${index}`} {...company} />
          ))}
        </div>

        <div className='flex animate-marquee whitespace-nowrap'>
          {recentCompanies.map((company, index) => (
            <CompanyItem key={`company-3-${index}`} {...company} />
          ))}
          {recentCompanies.map((company, index) => (
            <CompanyItem key={`company-4-${index}`} {...company} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBanner;
