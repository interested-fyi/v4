"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { UserCombinedProfile } from "@/types/return_types";

interface ProfileSettingsProps {
  onSubmit: (formDetails: {
    isAvailable: boolean;
    calendar: string;
    fee: string;
    bookingDescription: string;
  }) => void;
}
export const ProfileSettings = ({ onSubmit }: ProfileSettingsProps) => {
  const [form, setForm] = useState({
    calendar: "",
    fee: "",
    bookingDescription: "",
    isAvailable: true,
  });

  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);

  const { user, getAccessToken } = usePrivy();

  const {
    data: userProfileData,
    isLoading: userProfileDataLoading,
    error: userProfileError,
  } = useQuery({
    enabled: !!user,
    queryKey: ["user", user?.id?.replace("did:privy:", "")],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `/api/users/${user?.id?.replace("did:privy:", "")}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return (await res.json()) as {
        success: boolean;
        profile: UserCombinedProfile;
      };
    },
  });

  useEffect(() => {
    if (userProfileData?.success) {
      setForm({
        calendar: userProfileData.profile?.calendly_link ?? "",
        fee: userProfileData.profile?.unlock_calendar_fee ?? "",
        bookingDescription: userProfileData.profile?.booking_description ?? "",
        isAvailable: userProfileData.profile?.available ?? true,
      });
    }
  }, [userProfileData]);

  useEffect(() => {
    const isFormComplete = form.calendar && form.fee && form.bookingDescription;
    setIsProfileComplete(!isFormComplete);
  }, [form.calendar, form.fee, form.bookingDescription]);

  const handleButtonClick = (button: boolean) => {
    setForm({ ...form, isAvailable: button });
  };

  return (
    <>
      {" "}
      <div className='text-center text-[#1e1e1e] text-sm font-bold font-heading leading-[14px]'>
        <p className='mb-1'>READY TO APPEAR ON OUR TALENT PAGE?</p>
        <div className='flex gap-4 relative max-w-full'>
          <Button
            size='lg'
            className={`w-40 md:w-[180px] max-w-full rounded-[8px] font-heading font-bold uppercase justify-center text-center ${
              form.isAvailable === true
                ? "bg-[#2640EB] hover:bg-blue-600 hover:text-white text-yellow-200"
                : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
            }`}
            onClick={() => handleButtonClick(true)}
          >
            YES!
          </Button>

          <Button
            size='icon'
            onClick={() =>
              form.isAvailable === false
                ? handleButtonClick(true)
                : handleButtonClick(false)
            }
            className='bg-transparent hover:bg-transparent active:scale-95 transition-all duration-100 absolute right-[45%]'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='36'
              height='37'
              viewBox='0 0 36 37'
              fill='none'
            >
              <rect x='1' y='1.5' width='34' height='34' rx='17' fill='white' />
              <rect
                x='1'
                y='1.5'
                width='34'
                height='34'
                rx='17'
                stroke='#2640EB'
                strokeWidth='2'
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
          </Button>
          <Button
            size='lg'
            className={`w-40 md:w-[180px] rounded-[8px] font-heading font-bold uppercase justify-center ${
              form.isAvailable === false
                ? "bg-[#2640EB] text-white hover:bg-blue-600 hover:text-white"
                : "border-[#D3D8FB] border-2 bg-[#fff] text-[#919CF4]"
            }`}
            onClick={() => handleButtonClick(false)}
          >
            MAYBE LATER
          </Button>
        </div>
      </div>
      <div className='w-[343px] text-center text-gray-700 text-sm font-semibold font-body leading-[21px] pt-5 '>
        If you&apos;re on our talent page and looking for work, having
        prospective companies and recruiters book a call with you is a great
        first step.
        <br />
        <br />
        (You can also do this later in settings).
      </div>
      <div className='grid gap-4'>
        <div>
          <Label className='text-sm font-medium' htmlFor='calendar'>
            Scheduling link (Calendly, etc)
          </Label>
          <Input
            className='rounded-lg'
            id='calendar'
            onChange={(e) =>
              setForm({ ...form, calendar: e.target.value.trim() })
            }
          />
        </div>
        <div>
          <Label className='text-sm font-medium' htmlFor='fee'>
            Fee to unlock your calendar:
          </Label>
          <Input
            className='rounded-lg'
            id='fee'
            onChange={(e) => setForm({ ...form, fee: e.target.value.trim() })}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label className='text-sm font-medium' htmlFor='bookingDescription'>
            {`Description of your booking: (<180 characters)`}
          </Label>
          <Textarea
            className='rounded-lg'
            id='bookingDescription'
            onChange={(e) =>
              setForm({
                ...form,
                bookingDescription: e.target.value.trim(),
              })
            }
          />
        </div>
        <Button
          variant={"link"}
          className='text-center text-[#2640eb] text-sm font-medium font-body leading-[21px]'
        >
          Don&apos;t have a calendar? Create one
        </Button>
      </div>
      <Button
        className='w-full text-sm font-body font-medium leading-[21px] mt-4 bg-[#2640eb]'
        disabled={isProfileComplete}
        onClick={() => onSubmit(form)}
      >
        Save and continue to Interested
      </Button>
    </>
  );
};
