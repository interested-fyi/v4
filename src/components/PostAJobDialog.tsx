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
import { z } from "zod";
import Image from "next/image";

// Zod schema for validation
const postJobSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  careersPageUrl: z.string().url("Invalid URL"),
  email: z.string().email("Invalid email address"),
  telegramHandle: z.string().optional(),
});

export function PostAJob() {
  const [formData, setFormData] = useState({
    companyName: "",
    careersPageUrl: "",
    email: "",
    telegramHandle: "",
    recruitingHelp: false,
    hostBounty: false,
    telegramEasier: false,
  });

  const [errors, setErrors] = useState<{
    companyName?: { _errors: string[] };
    careersPageUrl?: { _errors: string[] };
    email?: { _errors: string[] };
    telegramHandle?: { _errors: string[] };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Validate form using Zod
  const validateForm = () => {
    const result = postJobSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors(fieldErrors);
      return false;
    }
    setErrors(null);
    return true;
  };

  const submitForm = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/create-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: formData }),
      });

      if (!response.ok) {
        throw new Error("Invalid API Response");
      }

      const result = await response.json();
      if (result) {
        setSubmitSuccess(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your company profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setSubmitSuccess(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      hourglass.register();
    }
  }, []);

  return (
    <Dialog onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger asChild>
        <Button
          variant='link'
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
            <div className='flex'>
              <DialogTitle className='text-center text-[#1e1e1e] text-4xl font-bold font-heading mx-auto leading-9'>
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
                  name='companyName'
                  placeholder='Company Name'
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
                {errors?.companyName && (
                  <p className='text-red-700 font-bold text-xs -top-1 relative'>
                    {errors?.companyName._errors[0]}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label
                  className='text-[#111928] text-sm font-medium font-body leading-[21px]'
                  htmlFor='careers-page'
                >
                  Your company&apos;s careers page (URL)
                </Label>
                <Input
                  id='careers-page'
                  name='careersPageUrl'
                  placeholder='https://'
                  value={formData.careersPageUrl}
                  onChange={handleInputChange}
                />
                {errors?.careersPageUrl && (
                  <p className='text-red-700 font-bold text-xs -top-1 relative'>
                    {errors?.careersPageUrl._errors[0]}
                  </p>
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
                  name='email'
                  type='email'
                  placeholder='name@example.com'
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors?.email && (
                  <p className='text-red-700 font-bold text-xs -top-1 relative'>
                    {errors?.email._errors[0]}
                  </p>
                )}
              </div>
            </div>
            <h3 className='text-center text-[#1e1e1e] text-xl font-bold font-heading leading-tight'>
              ADDITIONAL OPTIONS
            </h3>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center space-x-6'>
                <Input
                  type='checkbox'
                  className='h-6 w-6'
                  id='recruiting-help'
                  name='recruitingHelp'
                  checked={formData.recruitingHelp}
                  onChange={handleInputChange}
                />
                <Label
                  className='text-[#111928] text-sm font-medium font-body leading-[21px]'
                  htmlFor='recruiting-help'
                >
                  Do you need recruiting help?
                </Label>
              </div>
              <div className='flex items-center space-x-6'>
                <Input
                  type='checkbox'
                  className='h-6 w-6'
                  id='bounty-host'
                  name='hostBounty'
                  checked={formData.hostBounty}
                  onChange={handleInputChange}
                />
                <Label
                  className='text-[#111928] text-sm font-medium font-body leading-[21px]'
                  htmlFor='bounty-host'
                >
                  Do you want to host a bounty for your community?
                </Label>
              </div>
              <div className='flex items-center space-x-6'>
                <Input
                  type='checkbox'
                  className='h-6 w-6'
                  id='telegram-easier'
                  name='telegramEasier'
                  checked={formData.telegramEasier}
                  onChange={handleInputChange}
                />
                <Label
                  className='text-[#111928] text-sm font-medium font-body leading-[21px]'
                  htmlFor='telegram-easier'
                >
                  Is Telegram easier?
                </Label>
              </div>
              {formData.telegramEasier && (
                <div className='space-y-2'>
                  <Label className='text-[#111928] text-sm font-medium font-body leading-[21px]'>
                    Telegram Handle
                  </Label>
                  <Input
                    placeholder='@telegram'
                    name='telegramHandle'
                    value={formData.telegramHandle}
                    onChange={handleInputChange}
                  />
                  {errors?.telegramHandle && (
                    <p className='text-red-700 font-bold text-xs -top-1 relative'>
                      {errors?.telegramHandle._errors[0]}
                    </p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className='mt-12'>
              <Button
                className='place-self-end w-full bg-[#2640eb] hover:bg-[#2640eb] hover:font-bold hover:scale-[1.01] transition-all duration-100 hover:text-yellow-200 text-white text-sm font-medium font-body leading-[21px]'
                onClick={submitForm}
                disabled={
                  loading ||
                  !formData.companyName ||
                  !formData.careersPageUrl ||
                  !formData.email
                }
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
        <h1 className='text-center text-[#1e1e1e] text-2xl font-bold font-heading leading-normal'>
          YOUR COMPANY PROFILE HAS BEEN CREATED.
        </h1>
        <p className='w-[343px] text-center text-gray-700 text-sm font-semibold font-body leading-[21px]'>
          We will be in touch soon to help get your open positions and bounties
          posted.
        </p>
      </div>
    </div>
  );
}
