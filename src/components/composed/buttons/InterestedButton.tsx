"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Modal from "@/components/composed/modals/Modal";
import { DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ShareJobDetails } from "../ShareJobDetails";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

interface InterestedButtonProps {
  id?: string;
}
export function InterestedButton({ id }: InterestedButtonProps) {
  const pathName = usePathname();
  const jobId = pathName.split("/job-details/")[1];
  const searchParams = useSearchParams();
  const referrer = searchParams.get("referrer");

  const handleOpen = () => {
    if (!id) return;
    const modalButton = document.getElementById(id);
    if (modalButton) {
      modalButton.click();
    }
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        className='group max-h-11 max-w-full h-full self-stretch pl-[19px] pr-5 py-2.5 bg-blue-700 border border-blue-700 rounded-lg w-[137px] justify-center items-center gap-2 flex'
      >
        <Image
          height={20}
          width={20}
          alt='thumb icon'
          className='w-full max-w-[14.09px] h-4 group-hover:invert'
          src='/svg/whiteThumb.svg'
        />
        <div className='text-sm font-medium font-body leading-[21px]'>
          I&apos;m interested
        </div>
      </Button>
      <Modal
        title='You expressed interest!'
        description='
          We have notified the employer of your interest in this job. They will
          reach out to you if they are interested in your profile. Good luck!
        '
        trigger={
          <DialogTrigger id={id} className='hidden'>
            Open
          </DialogTrigger>
        }
        followButton={
          <div className='flex items-center flex-col justify-between w-full gap-12 pt-4'>
            <div className='flex gap-4'>
              <Link href='/explore'>
                <Button
                  className='bg-[#2640EB] text-[#E8FC6C]
              '
                >
                  Back to search
                </Button>
              </Link>
              <DialogClose asChild>
                <Button
                  variant={"outline"}
                  className='border-[#2640EB] text-[#2640EB]'
                >
                  Done
                </Button>
              </DialogClose>
            </div>
            <ShareJobDetails className='items-end' title='Share this job' />
          </div>
        }
      >
        <div className='flex w-full justify-center items-center gap-8 pb-4'>
          <Image
            src='/main-logo.png'
            alt='Interested illustration'
            width={200}
            height={200}
          />
        </div>
      </Modal>
    </>
  );
}
