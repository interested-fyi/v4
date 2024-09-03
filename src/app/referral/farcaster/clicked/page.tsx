"use client";
import { usePrivy } from "@privy-io/react-auth";
import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
export const dynamic = "force-dynamic";

const FarcasterReferralPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fid = searchParams.get("fid");
  const castHash = searchParams.get("castHash");
  const userName = searchParams.get("userName");
  const jobId = searchParams.get("jobId");
  const { getAccessToken } = usePrivy();
  const { data, error } = useQuery({
    queryKey: ["job-details", jobId],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const res = await fetch(`/api/jobs/get-job-by-id/${jobId}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.json();
    },
  });
  console.log("🚀 ~ logReferralClicked ~ {}:", {
    fid,
    url: `https://warpcast.com/${userName}/${castHash}`,
    jobId,
    castHash,
  });
  useEffect(() => {
    if (data?.job?.posting_url && fid && castHash && jobId && userName) {
      const logReferralClicked = async () => {
        try {
          await fetch("/api/referrals/farcaster/clicked", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fid,
              url: `https://warpcast.com/${userName}/${castHash}`,
              jobId,
              castHash,
            }),
          });
        } catch (error) {
          console.error("Error logging referral click:", error);
        }
      };

      logReferralClicked();
      router.replace(data?.job?.posting_url);
    }
  }, [fid, castHash, jobId, router, data, userName]);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return null;
};

const FarcasterReferralPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <FarcasterReferralPageContent />
  </Suspense>
);

export default FarcasterReferralPage;
