import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import JobPosting from "@/types/job-posting";
import jobUrlBuilder from "@/functions/general/job-url-builder";

interface JobPostingListProps {
  jobs: JobPosting[];
}

export function JobPostingList({ jobs }: JobPostingListProps) {
  return (
    <section className='grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6'>
      {jobs.map((job) => (
        <Card
          key={job.id}
          className='relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2'
        >
          <Link
            href={jobUrlBuilder(job.posting_url)}
            target="_blank"
            className='absolute inset-0 z-10'
            prefetch={false}
          >
            <span className='sr-only'>View job</span>
          </Link>
          <CardContent className='p-6 space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col gap-0'>
                <div className='text-sm font-medium text-muted-foreground'>
                  {job.company_name}
                </div>
                <div className='text-sm font-medium text-muted-foreground mt-0'>
                  {job.department}
                </div>
              </div>
              <div className='text-sm font-medium text-muted-foreground'>
                {job.sub_department}
              </div>
            </div>
            <div>
              <div className='text-lg font-semibold'>{job.role_title}</div>
              <div className='text-muted-foreground'>{job.type}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-muted-foreground'>{job.location}</div>
              <Button variant='outline' size='sm'>
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
