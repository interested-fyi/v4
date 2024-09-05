import { useEffect, useState } from "react";
import { hourglass } from "ldrs";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import Company from "@/types/company";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CompanySignUpForm() {
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
        toast({
          title: "Company Profile Created",
          description: "Your company profile has been created successfully",
        });
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      hourglass.register();
    }
  }, []);

  return (
    <div className='flex flex-col justify-center items-start gap-8 bg-[#919CF480] p-8 rounded-xl font-body'>
      <div className='flex flex-col gap-2 items-start'>
        <Label className='text-white text-xl font-bold'>Company Name</Label>
        <Input
          type='text'
          className='text-xl rounded-xl border-2 border-black px-2 py-1'
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-2 items-start'>
        <Label className='text-white text-xl font-bold'>
          Company Careers Page (url)
        </Label>
        <Input
          type='url'
          placeholder='https://'
          className='text-xl rounded-xl border-2 border-black px-2 py-1'
          onChange={(e) => setCareersPageUrl(e.target.value)}
        />
        {urlError !== "" && (
          <p className='text-red-700 font-bold'>{urlError}</p>
        )}
      </div>
      <div className='flex flex-col gap-2 items-start'>
        <Label className='text-white text-xl font-bold'>Your Email</Label>
        <Input
          type='email'
          className='text-xl rounded-xl border-2 border-black px-2 py-1'
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError !== "" && (
          <p className='text-red-700 font-bold'>{emailError}</p>
        )}
      </div>
      <div className='flex flex-col gap-2'>
        <Label className='text-white text-xl font-bold'>
          Additional Options
        </Label>
        <div className='flex gap-4 items-start align-baseline'>
          <Input
            type='checkbox'
            id='recruiting-help'
            className='mr-2 w-4'
            onChange={(e) => setRecruitingHelp(e.target.checked)}
          />
          <Label
            className='place-self-center text-sm'
            htmlFor='recruiting-help'
          >
            Need Recruiting Help?
          </Label>
        </div>
        <div className='flex gap-4 items-start align-baseline'>
          <Input
            type='checkbox'
            id='host-bounty'
            className='mr-2 w-4'
            onChange={(e) => setHostBounty(e.target.checked)}
          />
          <Label className='place-self-center text-sm' htmlFor='host-bounty'>
            Want to Host a Bounty for Your Community?
          </Label>
        </div>
        <div className='flex gap-4 items-start align-baseline'>
          <Input
            type='checkbox'
            id='telegram-easier'
            className='mr-2 w-4'
            onChange={(e) => setTelegramEasier(e.target.checked)}
          />
          <Label
            className='place-self-center text-sm'
            htmlFor='telegram-easier'
          >
            Is Telegram Easier?
          </Label>
        </div>
        {telegramEasier && (
          <div className='flex flex-col gap-2 items-start'>
            <Label className='text-white text-xl font-bold'>
              Telegram Handle
            </Label>
            <Input
              type='text'
              className='text-xl rounded-xl border-2 border-black px-2 py-1'
              onChange={(e) => setTelegramHandle(e.target.value)}
            />
            {telegramError !== "" && (
              <p className='text-red-700 font-bold'>{telegramError}</p>
            )}
          </div>
        )}
      </div>
      <Button
        disabled={loading}
        onClick={submitForm}
        size='lg'
        className='rounded-xl py-8 border border-[#E8FC6C] w-96 max-w-full bg-[#2640EB] text-[#E8FC6C] font-bold text-xl shadow-md'
      >
        {loading ? (
          <l-hourglass size='40' bg-opacity='0.1' speed='1.75' color='white' />
        ) : (
          "Create Company Profile"
        )}
      </Button>
    </div>
  );
}
