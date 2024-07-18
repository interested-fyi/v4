import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function SalaryQuiz() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-[#f5f5ff] md:flex-row md:gap-20'>
      <div className='flex max-w-[415px] flex-col items-center text-center md:items-start md:text-left'>
        <Image
          src='/svg/binocular-question.svg'
          alt='binoculars'
          height={20}
          width={20}
          className='w-20 h-20 text-[#6b6bff]'
        />
        <h2 className='mt-4 text-2xl font-semibold text-gray-800'>
          Unsure what salary range you should expect for your experience?
        </h2>
        <p className='mt-2 text-gray-500'>We&apos;ve got you covered.</p>
        <p className='mt-4 text-gray-600'>
          Select the role/title that best fits your most recent title, or the
          future position you&apos;re interested in.
          <br />
          Then, tell us where you live in so we can tailor a salary range based
          on cost of living in your area.
          <br />
          <br />
          It&apos;s that easy!
        </p>
      </div>
      <div className='w-[517px] max-w-full max-h-full h-[710px] relative bg-coins bg-no-repeat bg-center bg-cover transform rotate-[15deg]'>
        <Card className='absolute left-[-12px] md:left-8 top-20 md:top-40 w-full max-w-md mt-8 md:mt-0 transform rotate-[-15deg]'>
          <CardHeader>
            <CardTitle>Salary range finder</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Select>
              <SelectTrigger id='category'>
                <SelectValue placeholder='Choose a category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='category1'>Category 1</SelectItem>
                <SelectItem value='category2'>Category 2</SelectItem>
                <SelectItem value='category3'>Category 3</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger id='role' aria-label='Role'>
                <SelectValue placeholder='Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='role1'>Role 1</SelectItem>
                <SelectItem value='role2'>Role 2</SelectItem>
                <SelectItem value='role3'>Role 3</SelectItem>
              </SelectContent>
            </Select>
            <Select>
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
              <Input id='location' placeholder='Location' className='pl-10' />
            </div>
          </CardContent>
          <CardFooter>
            <Button className='w-full'>
              <SearchIcon className='mr-2 h-5 w-5' />
              Find your salary range
            </Button>
          </CardFooter>
        </Card>
      </div>
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

function XIcon({ ...props }) {
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
      <path d='M18 6 6 18' />
      <path d='m6 6 12 12' />
    </svg>
  );
}
