import { CompanyCard } from "./../../components/composed/companies/CompanyCard";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  return (
    <>
      <div className='flex flex-col px-28 h-64 max-h-full items-start md:items-center justify-center md:justify-between w-full bg-[#919CF4] border border-r-0 border-l-0 border-[#2640EB]'>
        <div className='flex flex-col w-full m-auto gap-8 items-start'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-white font-heading text-4xl font-bold'>
              FIND WHAT INTERESTS YOU.
            </h1>

            <p className='text-[#111928] font-body font-[600] w-[290px] max-w-full'>
              Explore companies and organizations hiring across the web3
              ecosystem.
            </p>
          </div>
          <div className='flex gap-4 relative'>
            <Button
              size='lg'
              className='w-52 rounded-[8px] bg-[#2640EB] font-heading font-bold uppercase justify-start'
            >
              companies
            </Button>
            <div className='absolute right-[46%]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='36'
                height='37'
                viewBox='0 0 36 37'
                fill='none'
              >
                <rect
                  x='1'
                  y='1.5'
                  width='34'
                  height='34'
                  rx='17'
                  fill='white'
                />
                <rect
                  x='1'
                  y='1.5'
                  width='34'
                  height='34'
                  rx='17'
                  stroke='#2640EB'
                  stroke-width='2'
                />
                <path
                  d='M23.7826 21.6874L9.90039 21.6874L9.90039 22.9623L23.7826 22.9623L21.0512 25.6994L21.9537 26.6L26.2199 22.3248L21.9537 18.0497L21.0512 18.9503L23.7826 21.6874Z'
                  fill='#2640EB'
                />
                <path
                  d='M14.1664 10.4L9.90015 14.6751L14.1664 18.9503L15.0689 18.0497L12.3375 15.3126L26.2197 15.3126L26.2197 14.0377L12.3375 14.0377L15.0689 11.3006L14.1664 10.4Z'
                  fill='#2640EB'
                />
              </svg>
            </div>
            <Button
              size='lg'
              className='w-52 rounded-[8px] border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4] font-heading font-bold uppercase justify-start'
            >
              jobs
            </Button>
          </div>
        </div>
      </div>
      <div className='py-24 px-12'>
        <CompanyCard />
      </div>
    </>
  );
}
