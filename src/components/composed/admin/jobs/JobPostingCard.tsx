import jobUrlBuilder from "@/functions/general/job-url-builder";
import JobPosting from "@/types/job-posting";
import Link from "next/link";

export function JobPostingCard({ job }: { job: JobPosting }) {
  return (
    <div className='flex flex-col gap-1 rounded-lg bg-background p-4 shadow-md '>
      <div className='flex flex-col gap-1 md:flex-row md:items-center md:gap-4'>
        <div>
          <h3 className='text-lg font-semibold'>{job.department}</h3>

          <p className='text-xs text-muted-foreground'>{job.sub_department}</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          {job.type ? (
            <span className='rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground'>
              {job.type}
            </span>
          ) : null}
          {job.role_title ? (
            <span className='rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground'>
              {job.role_title}
            </span>
          ) : null}
        </div>
      </div>
      <div className='flex items-center gap-2 md:ml-auto'>
        <MapPinIcon className='h-4 w-4 text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>{job.location}</span>
        {job.active ? (
          <span className='rounded-full bg-green-100 px-2 py-1 text-xs text-green-800'>
            Active
          </span>
        ) : (
          <span className='rounded-full bg-red-100 px-2 py-1 text-xs text-red-800'>
            Inactive
          </span>
        )}
      </div>
      <div className='mt-2 md:mt-0'>
        <Link
          href={jobUrlBuilder(job.posting_url)}
          target="_blank"
          className='text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80'
          prefetch={false}
        >
          View Posting
        </Link>
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
