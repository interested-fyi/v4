import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
export function CompanyCard() {
  return (
    <Card className='relative w-[252px] max-w-full rounded-[8px] border border-[#919CF4] bg-[#fff] shadow-md shadow-[0px 8px 14px 0px rgba(38, 64, 235, 0.10)]'>
      <div className='absolute top-[-38px] left-6'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='80'
          height='80'
          viewBox='0 0 80 80'
          fill='none'
        >
          <rect width='80' height='80' rx='40' fill='#FF0420' />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M19.0365 50.327C20.815 51.6375 23.099 52.2928 25.8886 52.2928C29.2584 52.2928 31.9543 51.5252 33.9575 49.9526C35.9795 48.3613 37.3836 45.9462 38.2073 42.7448C38.7128 40.7791 39.1247 38.7384 39.4804 36.6603C39.5927 35.9115 39.6489 35.2936 39.6489 34.8069C39.6489 33.1781 39.237 31.774 38.4133 30.5945C37.5895 29.3964 36.4662 28.4977 35.0434 27.9174C33.6205 27.2995 31.9918 27 30.1945 27C23.5671 27 19.4483 30.2201 17.857 36.6603C17.2954 39.0379 16.8648 41.0599 16.5652 42.7448C16.4529 43.4937 16.3967 44.1115 16.3967 44.6357C16.3967 47.0882 17.2766 48.9978 19.0365 50.327ZM29.7265 46.0773C28.8091 46.8448 27.7045 47.238 26.394 47.238C24.1474 47.238 23.0054 46.1709 23.0242 43.9992C23.0242 43.475 23.0803 42.9882 23.1739 42.5202C23.6045 40.2361 24.0164 38.3265 24.447 36.7539C24.8401 35.1439 25.4954 33.9644 26.4128 33.1968C27.3488 32.4292 28.4721 32.0361 29.7826 32.0361C32.0105 32.0361 33.1151 33.1032 33.1151 35.2375C33.1151 35.7617 33.0589 36.2672 32.9653 36.7539C32.6845 38.4014 32.2726 40.311 31.7297 42.5202C31.3365 44.1302 30.6625 45.3097 29.7265 46.0773ZM40.6787 51.7124C40.8284 51.8809 41.0156 51.9558 41.2777 51.9558H46.0517C46.2951 51.9558 46.5198 51.8809 46.7257 51.7124C46.9504 51.5439 47.0627 51.338 47.1189 51.0759L48.7289 43.3813H53.4655C56.5358 43.3813 58.9509 42.7448 60.7107 41.453C62.508 40.1612 63.6874 38.1767 64.2678 35.4808C64.3988 34.8443 64.4737 34.2265 64.4737 33.6461C64.4737 31.6055 63.6687 30.0516 62.0774 28.9657C60.5048 27.8986 58.4267 27.3557 55.8244 27.3557H46.4823C46.239 27.3557 46.0143 27.4306 45.8084 27.5991C45.5837 27.7676 45.4526 27.9735 45.4152 28.2356L40.5663 51.0759C40.5289 51.3193 40.5663 51.5252 40.6787 51.7124ZM56.2737 37.7274C55.5436 38.2703 54.7011 38.5324 53.7089 38.5324H49.6837L51.0129 32.242H55.2253C56.1801 32.242 56.8728 32.4292 57.2659 32.8036C57.6591 33.1594 57.865 33.6836 57.865 34.3575C57.865 34.6571 57.8276 35.0128 57.7527 35.4059C57.5093 36.4169 57.0226 37.1845 56.2737 37.7274Z'
            fill='white'
          />
        </svg>
      </div>
      <CardContent className='p-6 pt-[58px] flex flex-col gap-2 justify-start items-start w-full'>
        <CardTitle className='text-[#111928] font-heading text-xl font-bold'>
          Company Name
        </CardTitle>
        <CardDescription className='text-[#000] font-body text-sm font-[400]'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
          obcaecati quia consectetur facilis necessitatibus. Quidem, laboriosam
          vel.
        </CardDescription>
        <CardFooter className='px-0 pb-0'>
          <Badge
            className='rounded-[8px] border-[#919CF4] font-body text-[#2640EB]'
            variant={"outline"}
          >
            Defi
          </Badge>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
