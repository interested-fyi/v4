import { NextRequest, NextResponse } from "next/server";
import easAbi from "@ethereum-attestation-service/eas-contracts/deployments/optimism/EAS.json";
import { mnemonicToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { optimism, optimismSepolia } from "viem/chains";
import { publicClient } from "@/lib/viemClient";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("Incoming request to scrape job details...");

  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.log("Unauthorized request. Authorization header does not match.");
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  try {
    // Step 1: Fetch job_posting_ids from job_details_last_scraping where active = false
    const { data: jobDetails, error: jobDetailsError } = await supabase
      .from("job_details_last_scraping")
      .select("id")
      .eq("active", false);

    if (jobDetailsError) throw jobDetailsError;

    const jobDetailsIDs = jobDetails.map((detail) => detail.id);
    console.log("🚀 ~ GET ~ jobDetailsIDs:", jobDetailsIDs);

    // Step 2: Fetch job_posting_ids from job_postings_details matching jobDetailsIDs
    const { data: jobPostings, error: jobPostingsError } = await supabase
      .from("job_postings_details")
      .select("job_posting_id")
      .in("job_posting_id", jobDetailsIDs);
    console.log("🚀 ~ GET ~ jobPostings:", jobPostings);

    if (jobPostingsError) throw jobPostingsError;

    const jobPostingIDs = jobPostings.map((posting) => posting.job_posting_id);
    console.log("🚀 ~ GET ~ jobPostingIDs:", jobPostingIDs);

    // Step 3: Fetch attestation_uids from job_attestations where active = true and job_posting_id matches
    const { data: attestations, error: attestationsError } = await supabase
      .from("job_attestations")
      .select("attestation_uid")
      .eq("active", true)
      .in("job_posting_id", jobPostingIDs)
      .limit(5);
    console.log("🚀 ~ GET ~ attestations:", attestations);

    if (attestationsError) throw attestationsError;

    const account = mnemonicToAccount(process.env.ADMIN_MNEMONIC as string);
    const client = createWalletClient({
      account,
      chain:
        process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
          ? optimismSepolia
          : optimism,
      transport: http(),
    });
    // Attestation creation
    const attestationsData = attestations.map((attestation) => ({
      uid: attestation.attestation_uid,
      value: 0,
    }));
    console.log("🚀 ~ attestationsData ~ attestationsData:", attestationsData);

    const contractParams = {
      address: process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS as `0x${string}`,
      abi: easAbi.abi,
      functionName: "multiRevoke",
      args: [
        [
          {
            schema:
              process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
                ? process.env.NEXT_PUBLIC_SEPOLIA_JOB_SCHEMA_UID
                : process.env.NEXT_PUBLIC_JOB_SCHEMA_UID,
            data: attestationsData,
          },
        ],
      ],
      chain:
        process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
          ? optimismSepolia
          : optimism,
      account: client.account,
    };
    console.log("🚀 ~ GET ~ contractParams:", contractParams.args);

    console.log("Checking account balance...");
    const balance = await publicClient.getBalance({
      address: client.account.address,
    });

    console.log("Account balance:", balance.toString());
    if (BigInt(balance) === BigInt(0)) {
      throw new Error(
        "Account has insufficient funds to perform this transaction."
      );
    }
    if (attestations.length === 0) {
      console.log("No attestations to revoke.");
      return NextResponse.json("No attestations to revoke", { status: 200 });
    }

    try {
      console.log("Simulating attestation contract call...");
      const nonce = await publicClient.getTransactionCount({
        address: account.address,
      });

      const { request } = await publicClient.simulateContract({
        ...contractParams,
        nonce,
        account: client.account,
      });

      const txHash = await client.writeContract({
        ...request,
        nonce,
      });

      console.log("Attestation Transaction Hash:", txHash);
      if (txHash) {
        //update job_attestations set active = false where attestation_uid in attestations
        const { error: updateAttestationsError } = await supabase
          .from("job_attestations")
          .update({ active: false, revoked_at: `${new Date()}` })
          .in(
            "attestation_uid",
            attestations.map((attestation) => attestation.attestation_uid)
          );

        if (updateAttestationsError) {
          throw Error("Error updating job_attestations");
        }
      }
      return NextResponse.json("Success", { status: 200 });
    } catch (e) {
      console.error(e);
      return NextResponse.json("Error", { status: 500 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json("Error", { status: 500 });
  }
}
