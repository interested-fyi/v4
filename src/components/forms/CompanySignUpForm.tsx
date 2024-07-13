import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { hourglass } from "ldrs";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import User from "@/types/user";
import Company from "@/types/company";
import { useRouter } from "next/navigation";

export default function CompanySignUpForm() {
    const {ready, authenticated, login, user, getAccessToken} = usePrivy();
    const [companyName, setCompanyName] = useState('');
    const [careersPageUrl, setCareersPageUrl] = useState('');
    const [email, setEmail] = useState('');
    const [urlError, setUrlError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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

    async function submitForm() {
        setLoading(true);
        setUrlError("");
        setEmailError("");

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

    console.log(`FC User: ${JSON.stringify(user?.farcaster?.username)}`)
    try {
      const accessToken = await getAccessToken();
      const response = await fetch("/api/create-company", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user: {
            created_at: user?.createdAt,
            privy_did: user?.id,
            fid: user?.farcaster?.fid,
            email: user?.email,
            username: user?.farcaster?.username
          } as User,
          company: {
            company_name: companyName,
            careers_page_url: careersPageUrl,
            creator_email: email,
            creator_fid: user?.farcaster?.fid,
            creator_privy_did: user?.id
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
      {!authenticated ? (
        <div className='flex flex-col items-center gap-4'>
          <p className='text-xl font-bold'>Connect your Farcaster</p>

          <button
            onClick={login}
            className='flex items-center gap-4 bg-[#8A63D2] px-4 py-2 rounded-xl w-max'
          >
            <Image
              className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
              src='/fc-logo-transparent-white.png'
              alt='Farcaster Logo'
              width={40}
              height={50}
              priority
            />
            <p className='text-white font-bold text-xl'>Connect</p>
          </button>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-2 items-start'>
            <p className='text-white text-xl font-bold'>Company Name</p>
            <input
              type='text'
              className='text-xl rounded-xl border-2 border-black px-2 py-1'
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2 items-start'>
            <p className='text-white text-xl font-bold'>
              Company Careers Page (url)
            </p>
            <input
              type='url'
              placeholder="https://"
              className='text-xl rounded-xl border-2 border-black px-2 py-1'
              onChange={(e) => setCareersPageUrl(e.target.value)}
            />
            {urlError !== "" && (
              <p className='text-red-700 font-bold'>{urlError}</p>
            )}
          </div>
          <div className='flex flex-col gap-2 items-start'>
            <p className='text-white text-xl font-bold'>Your Email</p>
            <input
              type='email'
              className='text-xl rounded-xl border-2 border-black px-2 py-1'
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError !== "" && (
              <p className='text-red-700 font-bold'>{emailError}</p>
            )}
          </div>
          <Button
            disabled={loading}
            onClick={submitForm}
            size='lg'
            className='rounded-xl py-8 border border-[#E8FC6C] w-96 max-w-full bg-[#2640EB] text-[#E8FC6C] font-bold text-xl shadow-md'
          >
            {loading ? (
              <l-hourglass
                size='40'
                bg-opacity='0.1'
                speed='1.75'
                color='white'
              />
            ) : (
              "Create Company Profile"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
