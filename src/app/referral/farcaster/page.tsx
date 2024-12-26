"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const FarcasterReferralPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fid = searchParams.get("fid");
  const userName = searchParams.get("userName");
  const castHash = searchParams.get("castHash");
  const jobId = searchParams.get("jobId");
  const jobUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/job-details/${jobId}`;

  useEffect(() => {
    console.log();
    if (fid && castHash && userName) {
      const logReferralGeneration = async () => {
        try {
          await fetch("/api/referrals/farcaster/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fid,
              jobId,
              castHash,
            }),
          });
        } catch (error) {
          console.error("Error logging referral click:", error);
        }
      };

      logReferralGeneration();
      // Redirect to the provided URL after logging
    }
  }, [fid, castHash, userName, jobId, jobUrl, router]);

  return (
    <CopyToClip
      fid={fid ?? ""}
      castHash={castHash ?? ""}
      jobId={jobId ?? ""}
      userName={userName ?? ""}
    />
  );
};

interface CopyToClipProps {
  fid: string;
  castHash: string;
  jobId: string;
  userName: string;
}

function CopyToClip({ fid, castHash, jobId, userName }: CopyToClipProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/referral/farcaster/clicked?fid=${fid}&jobId=${jobId}&castHash=${castHash}&userName=${userName}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className='min-h-screen bg-[#4040FF] flex flex-col items-center justify-center p-4'>
      <h1 className='text-4xl md:text-6xl font-bold text-white mb-8 text-center'>
        SHARE YOUR REFERRAL LINK
      </h1>
      <Button
        onClick={copyToClipboard}
        className={`
          ${copied ? "bg-[#E6FF5C] text-[#4040FF]" : "bg-white text-[#4040FF]"}
          hover:bg-[#E6FF5C] hover:text-[#4040FF]
          transition-colors duration-300 ease-in-out
          font-bold py-3 px-6 rounded-full text-lg
          flex items-center space-x-2
        `}
      >
        <Copy className='w-5 h-5' />
        <span>{copied ? "Copied!" : "Copy Referral Link"}</span>
      </Button>
    </div>
  );
}

const FarcasterReferralPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <FarcasterReferralPageContent />
  </Suspense>
);

export default FarcasterReferralPage;
