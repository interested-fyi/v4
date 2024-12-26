import jobUrlBuilder from "@/functions/general/job-url-builder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OnchainBadge } from "./OnchainBadge";
import JobPosting from "@/types/job-posting";
import Link from "next/link";

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
          <CardContent className='p-6 space-y-4'>
            {/* {job.job_attestations && job.job_attestations?.length > 0 && (
              <div className='flex flex-row gap-3 absolute bottom-3 right-3'>
                <OnchainBadge
                  attestationUrl={`https://optimism.easscan.org/attestation/view/${job.job_attestations[0]?.attestation_uid}`}
                />
              </div>
            )} */}
            <div className='flex items-center justify-between'>
              <div className='flex flex-row gap-3'>
                <div className='text-[#1a56db] text-sm font-semibold font-body leading-[21px]'>
                  {job.company_name}
                </div>
                <div className='text-gray-600 text-sm font-medium font-body leading-[21px]'>
                  {job.department}
                </div>
              </div>
              <div className='text-sm font-medium text-muted-foreground'>
                {job.sub_department}
              </div>
            </div>
            <div>
              <div className='text-black text-base font-semibold font-body leading-normal'>
                {job.role_title}
              </div>
              <div className='text-muted-foreground'>{job.type}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-gray-500 text-xs font-medium font-body leading-[18px]'>
                {job.location}
              </div>
            </div>
            <Link
              href={jobUrlBuilder(job.posting_url)}
              target='_blank'
              prefetch={false}
            >
              <span className='sr-only'>View job</span>

              <Button
                variant='outline'
                size='sm'
                className='place-self-end mt-4 text-gray-700 w-[120px] text-xs font-medium font-body leading-[18px] border border-gray-700 '
              >
                Apply
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
