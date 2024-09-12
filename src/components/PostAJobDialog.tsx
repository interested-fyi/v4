"use client";
import { useEffect, useState } from "react";
import { hourglass } from "ldrs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";
import Company from "@/types/company";
import Image from "next/image";

export function PostAJob() {
  const [companyName, setCompanyName] = useState("");
  const [careersPageUrl, setCareersPageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [urlError, setUrlError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [telegramEasier, setTelegramEasier] = useState(false);
  const [recruitingHelp, setRecruitingHelp] = useState(false);
  const [hostBounty, setHostBounty] = useState(false);
  const [telegramError, setTelegramError] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateTelegram = (handle: string) => {
    if ((!handle || handle.length === 0) && telegramEasier) {
      return false;
    }
    return true;
  };

  async function submitForm() {
    setLoading(true);
    setUrlError("");
    setEmailError("");
    setTelegramError("");

    if (!validateUrl(careersPageUrl)) {
      setUrlError("Invalid URL");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Invalid Email Address");
      setLoading(false);
      return;
    }

    if (!validateTelegram(telegramHandle)) {
      setTelegramError("Invalid telegram handle");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-company", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          company: {
            company_name: companyName,
            careers_page_url: careersPageUrl,
            creator_email: email,
            recruiting_help: recruitingHelp,
            host_bounty: hostBounty,
            telegram_handle: telegramHandle,
          } as Company,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid API Response");
      }

      const result = await response.json();
      if (result) {
        setSubmitSuccess(true);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "There was an error creating your company profile",
      });
    } finally {
      setLoading(false);
    }
  }

  const onClose = () => {
    setSubmitSuccess(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      hourglass.register();
    }
  }, []);

  return (
    <Dialog
      onOpenChange={(e) => {
        if (e.valueOf() === false) {
          onClose();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className='text-center my-0 py-0 h-fit text-white text-sm font-semibold font-body underline leading-[21px]'
        >
          I want to post a job
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] h-full justify-center bg-[#e0f0ff] flex flex-col gap-9'>
        {submitSuccess ? (
          <SuccessMessage />
        ) : (
          <>
            {" "}
            <div className='flex'>
              <DialogTitle className='text-[#1e1e1e] mx-auto text-4xl font-bold font-heading leading-9'>
                POST A JOB
              </DialogTitle>
            </div>
            <div className='flex flex-col gap-4'>
              <div className='space-y-2'>
                <Label
                  className='text-[#111928] text-sm font-medium font-body leading-[21px]'
                  htmlFor='company-name'
                >
                  Company Name
                </Label>
                <Input
                  id='company-name'
                  placeholder='Company Name'
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                {urlError && (
                  <p className='text-red-700 font-bold'>{urlError}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='careers-page'
                  className='text-[#111928] text-sm font-medium font-body leading-[21px]'
                >
                  Your company&apos;s careers page (url)
                </Label>
                <Input
                  id='careers-page'
                  placeholder='https://'
                  onChange={(e) => setCareersPageUrl(e.target.value)}
                />
                {urlError && (
                  <p className='text-red-700 font-bold'>{urlError}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label
                  className='text-[#111928] text-sm font-medium font-body leading-[21px]'
                  htmlFor='email'
                >
                  Your email
                </Label>
                <Input
                  id='email'
                  placeholder='name@example.com'
                  type='email'
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className='text-red-700 font-bold'>{emailError}</p>
                )}
              </div>
            </div>
            <h3 className='text-[#1e1e1e] mx-auto text-xl font-bold font-heading leading-tight'>
              ADDITIONAL OPTIONS
            </h3>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center space-x-6'>
                <Input
                  type='checkbox'
                  className='h-6 w-6 text-[#111928] text-sm font-medium font-body leading-[21px]'
                  id='recruiting-help'
                  onChange={(e) => setRecruitingHelp(e.target.checked)}
                />
                <Label htmlFor='recruiting-help'>
                  Do you need recruiting help?
                </Label>
              </div>
              <div className='flex items-center space-x-6'>
                <Input
                  type='checkbox'
                  className='h-6 w-6 text-[#111928] text-sm font-medium font-body leading-[21px]'
                  id='bounty-host'
                  onChange={(e) => setHostBounty(e.target.checked)}
                />
                <Label htmlFor='bounty-host'>
                  Do you want to host a bounty for your community?
                </Label>
              </div>
              <div className='flex items-center space-x-6'>
                <Input
                  type='checkbox'
                  className='h-6 w-6 text-[#111928] text-sm font-medium font-body leading-[21px]'
                  id='telegram-easier'
                  onChange={(e) => setTelegramEasier(e.target.checked)}
                />
                <Label htmlFor='telegram-easier'>Is Telegram easier?</Label>
              </div>
              {telegramEasier && (
                <div className='space-y-2'>
                  <Label className='text-[#111928] text-sm font-medium font-body leading-[21px]'>
                    Telegram Handle
                  </Label>
                  <Input
                    placeholder='@telegram'
                    onChange={(e) => setTelegramHandle(e.target.value)}
                  />
                  {telegramError && (
                    <p className='text-red-700 font-bold'>{telegramError}</p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className='mt-12'>
              <Button
                className='place-self-end w-full bg-[#2640eb] hover:bg-[#2640eb] hover:font-bold hover:scale-[1.01] transition-all duration-100 hover:text-yellow-200 text-white text-sm font-medium font-body leading-[21px]'
                onClick={submitForm}
                disabled={loading || !companyName || !careersPageUrl || !email}
              >
                {loading ? (
                  <l-hourglass
                    size='40'
                    bg-opacity='0.1'
                    speed='1.75'
                    color='white'
                  />
                ) : (
                  "Create company profile"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessMessage() {
  return (
    <div className='w-[343px] h-full flex-col justify-center items-center gap-10 inline-flex'>
      <div className='flex-col justify-center items-center gap-5 flex'>
        <Image
          alt='interested binoculars'
          width={75.14}
          height={16}
          className='w-[75.14px] h-16'
          src='/svg/Union.svg'
        />
        <div className='h-12 flex-col justify-start items-center gap-6 flex'>
          <div className='self-stretch text-center text-[#1e1e1e] text-2xl font-bold font-heading leading-none'>
            YOUR COMPANY PROFILE HAS BEEN CREATED.
          </div>
        </div>
        <div className='w-[343px] text-center text-gray-700 text-sm font-semibold font-body leading-[21px]'>
          We will be in touch soon to help get your open positions and bounties
          posted.
        </div>
      </div>
    </div>
  );
}
