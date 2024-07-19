import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

export default function Profile() {
  return (
    <div className='flex flex-col md:flex-row gap-4 p-4 md:p-8 md:pt-0 font-body border-t border-t-blue-700'>
      <div className='flex flex-col items-start md:w-1/4 max-w-[340px] pt-8'>
        <div className='flex flex-col gap-1 items-center sm:items-start w-full max-w-full md:max-w-[214px] md:ml-auto md:mr-2'>
          <Avatar className='w-40 h-40 mb-4 border-2 border-blue-700 rounded-full'>
            <AvatarImage src='/placeholder-user.jpg' />
            <AvatarFallback>CL</AvatarFallback>
          </Avatar>
          <h2 className='text-xl font-bold text-gray-600'>Chester LaCroix</h2>
          <div className='flex items-center mt-0 text-blue-700 font-semibold'>
            <CheckIcon className='w-4 h-4 mr-2' />
            <span>AVAILABLE FOR HIRE</span>
          </div>
          <Separator className='my-4 w-full' />
          <div className='flex gap-2 items-start'>
            <Image
              src={"/svg/search.svg"}
              width={18}
              height={18}
              alt='search icon'
              className='mt-1  relative sm:left-0 left-8'
            />
            <p className='text-center sm:text-left'>
              Looking for{" "}
              <span className='font-bold text-gray-600'>
                part-time work, bug bounties
              </span>
            </p>
          </div>
          <Separator className='my-4 w-full' />
          <div className='flex gap-2 items-start'>
            <Image
              src={"/svg/location-icon.svg"}
              width={18}
              height={18}
              alt='location icon'
              className='mt-3'
            />
            <p className='mt-2 text-center sm:text-left'>Denver, CO, USA</p>
          </div>
          <div>
            <div className='flex gap-2 items-start'>
              <Image
                src={"/svg/briefcase.svg"}
                width={18}
                height={18}
                alt='location icon'
                className='mt-3'
              />
              <p className='mt-2 text-center sm:text-left text-gray-600'>
                <span className='font-bold text-gray-600'>Product Design </span>
                at{" "}
                <a href='#' className='text-blue-700'>
                  Astaria
                </a>
              </p>
            </div>
          </div>

          <Button
            variant='default'
            className='mt-4 bg-blue-700 rounded-lg w-full h-[41px]'
          >
            Request email
          </Button>
          <Separator className='my-4 w-full' />
          <div className='text-left flex flex-col gap-4 font-medium'>
            <a href='#' className='flex gap-2 text-blue-700'>
              <Image
                src={"/svg/globe.svg"}
                width={18}
                height={18}
                alt='globe icon'
              />{" "}
              lacroixnotlacroix.xyz
            </a>
            <a href='#' className='flex gap-2 text-blue-700'>
              <Image
                src={"/svg/twitter.svg"}
                width={18}
                height={18}
                alt='twitter icon'
              />
              @0xLaCroix
            </a>
          </div>
          <Separator className='my-4 w-full' />
          <div className='flex -space-x-2'>
            <Avatar className='w-8 h-8 border-2 border-gray-300 rounded-full'>
              <AvatarImage src='/placeholder-user.jpg' />
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
            <Avatar className='w-8 h-8 border-2 border-gray-300 rounded-full'>
              <AvatarImage src='/placeholder-user.jpg' />
              <AvatarFallback>2</AvatarFallback>
            </Avatar>
            <Avatar className='w-8 h-8 border-2 border-gray-300 rounded-full'>
              <AvatarImage src='/placeholder-user.jpg' />
              <AvatarFallback>3</AvatarFallback>
            </Avatar>
          </div>
          <p className='mt-2 text-left'>48 Connections</p>
          <Button
            variant='default'
            className='mt-4 bg-blue-700 rounded-lg w-full h-[41px]'
          >
            Connect with Chester
          </Button>
        </div>
      </div>
      <div className='flex flex-col md:w-2/4 max-w-[608px] md:border-l md:border-r px-0 md:px-8 pt-8'>
        <div className=' pb-4 flex flex-col gap-4 rounded-md mb-4'>
          <h3 className='text-xl font-bold mb-2 text-gray-600'>Interests</h3>
          <div className='flex flex-wrap gap-4'>
            <Badge
              className='gap-2 rounded-sm border border-[#919CF4] text-base bg-[rgba(145,156,244,0.20)] text-[#5063EF] hover:bg-[rgba(145,156,244,.4)] font-body font-medium h-10 px-3'
              variant='default'
            >
              AMMs
            </Badge>
            <Badge
              className='gap-2 rounded-sm border border-[#919CF4] text-base bg-[rgba(145,156,244,0.20)] text-[#5063EF] hover:bg-[rgba(145,156,244,.4)] font-body font-medium h-10 px-3'
              variant='default'
            >
              Blockchain
            </Badge>
            <Badge
              className='gap-2 rounded-sm border border-[#919CF4] text-base bg-[rgba(145,156,244,0.20)] text-[#5063EF] hover:bg-[rgba(145,156,244,.4)] font-body font-medium h-10 px-3'
              variant='default'
            >
              DAOs
            </Badge>
            <Badge
              className='gap-2 rounded-sm border border-[#919CF4] text-base bg-[rgba(145,156,244,0.20)] text-[#5063EF] hover:bg-[rgba(145,156,244,.4)] font-body font-medium h-10 px-3'
              variant='default'
            >
              DeFi
            </Badge>
          </div>
        </div>
        <div className=' p-4 rounded-md'>
          <h3 className='text-xl font-bold mb-2 text-gray-600 font-body'>
            Projects and work history
          </h3>
        </div>
        <ScrollArea className='flex-1'>
          <Card className='mb-6'>
            <CardHeader className='flex flex-row items-center p-3 bg-gray-100'>
              <Avatar className='w-12 h-12'>
                <AvatarImage src='/placeholder-user.jpg' />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className='ml-4'>
                <CardTitle className='text-gray-600 text-base'>
                  <span>Product Design </span> at{" "}
                  <a href='#' className='text-blue-500'>
                    Astaria
                  </a>
                </CardTitle>
                <CardDescription>July 2023 - Present</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Image
                width={400}
                height={200}
                src='/placeholder.svg'
                alt='Project Image'
                className='w-full my-6'
              />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center p-3 bg-gray-100'>
              <Avatar className='w-12 h-12'>
                <AvatarImage src='/placeholder-user.jpg' />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className='ml-4'>
                <CardTitle>
                  Product Design at{" "}
                  <a href='#' className='text-blue-500'>
                    Atlas.xyz
                  </a>
                </CardTitle>
                <CardDescription>June 2022 - February 2023</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Image
                width={400}
                height={200}
                src='/placeholder.svg'
                alt='Project Image'
                className='w-full my-6'
              />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>
      <div className='flex flex-col md:w-1/4 pt-8 md:ml-4'>
        <h3 className='text-xl font-bold mb-4 text-gray-600'>
          Endorsements from connections
        </h3>
        <Card className='mb-6'>
          <CardHeader className='bg-gray-100 p-4 rounded-md rounded-b-none flex flex-row gap-4 items-center'>
            <Avatar className='w-12 h-12'>
              <AvatarImage src='/placeholder-user.jpg' />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div>
              <h4 className='font-bold text-blue-500'>Jeremie Perrier</h4>
              <p className='text-sm text-muted-foreground'>
                September 23rd, 2023
              </p>
            </div>
          </CardHeader>
          <CardContent className='p-6 flex flex-col gap-4'>
            <p className='font-bold text-sm '>
              FMR COWORKER AT{" "}
              <a href='#' className='text-blue-500'>
                SUSHI
              </a>
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='bg-gray-100 p-4 rounded-md rounded-b-none flex flex-row gap-4 items-center'>
            <Avatar className='w-12 h-12'>
              <AvatarImage src='/placeholder-user.jpg' />
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
            <div>
              <h4 className='font-bold text-blue-500'>Tina Haibodi</h4>
              <p className='text-sm text-muted-foreground'>August 14th, 2023</p>
            </div>
          </CardHeader>
          <CardContent className='p-6 flex flex-col gap-4'>
            <p className='font-bold text-sm'>FRIEND / ASSOCIATE</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CheckIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='4'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M20 6 9 17l-5-5' />
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
