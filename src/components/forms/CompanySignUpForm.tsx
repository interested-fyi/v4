import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { hourglass } from "ldrs";

export default function CompanySignUpForm() {
  const { ready, authenticated, login, user } = usePrivy();
  const [companyName, setCompanyName] = useState("");
  const [careersPageUrl, setCareersPageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [urlError, setUrlError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

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
    const delay = async () =>
      new Promise((resolve) => setTimeout(resolve, 2000));
    await delay();

    if (!validateUrl(careersPageUrl)) {
      setUrlError("Invalid URL");
    }
    if (!validateEmail(email)) {
      setEmailError("Invalid Email Address");
    }

    try {
      const response = await fetch("/api/create-company", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          fid: user?.farcaster?.fid,
          user_id: user?.id,
          owner_address: user?.farcaster?.ownerAddress,
          company_name: companyName,
          careers_url: careersPageUrl,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid API Response");
      }

      const result = await response.json();
    } catch (e) {
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
    <div className='flex flex-col justify-center items-center gap-8'>
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
          <div className='flex flex-col gap-2 items-center'>
            <p className='text-xl font-bold'>Company Name</p>
            <input
              type='text'
              className='text-xl rounded-xl border-2 border-black px-2 py-1'
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2 items-center'>
            <p className='text-xl font-bold'>Company Careers Page (url)</p>
            <input
              type='url'
              className='text-xl rounded-xl border-2 border-black px-2 py-1'
              onChange={(e) => setCareersPageUrl(e.target.value)}
            />
            {urlError !== "" && (
              <p className='text-red-700 font-bold'>{urlError}</p>
            )}
          </div>
          <div className='flex flex-col gap-2 items-center'>
            <p className='text-xl font-bold'>Your Email</p>
            <input
              type='email'
              className='text-xl rounded-xl border-2 border-black px-2 py-1'
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError !== "" && (
              <p className='text-red-700 font-bold'>{emailError}</p>
            )}
          </div>
          <button
            disabled={loading}
            onClick={submitForm}
            className='px-4 py-4 rounded-xl w-[350px] bg-[#2640EB] text-white font-bold text-2xl'
          >
            {loading ? (
              <l-hourglass
                size='40'
                bg-opacity='0.1'
                speed='1.75'
                color='white'
              />
            ) : (
              <p>Create Company Profile</p>
            )}
          </button>
        </>
      )}
    </div>
  );
}
