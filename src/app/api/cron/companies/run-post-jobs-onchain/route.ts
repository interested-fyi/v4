import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import easAbi from "@ethereum-attestation-service/eas-contracts/deployments/optimism/EAS.json";
import { mnemonicToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { optimism, optimismSepolia } from "viem/chains";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { publicClient } from "@/lib/viemClient";

import { getOnchainJobsUids } from "@/functions/general/get-onchain-job-uid";

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("Incoming request to scrape job details...");

  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.log("Unauthorized request. Authorization header does not match.");
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  try {
    // Fetch job postings that are NOT in the job_attestations table
    const { data: jobPostings, error: jobPostingsError } = await supabase
      .from("job_details_last_scraping")
      .select(
        `
        id,
        company_id,
        job_attestations!left (
          attestation_uid
          )
          `
      )
      .is("job_attestations", null) // This filters for rows where job_attestations is null
      .eq("active", true)
      .limit(10);
    console.log("🚀 ~ GET ~ jobPostings:", jobPostings);

    if (jobPostingsError) {
      console.error("Error fetching job postings:", jobPostingsError);
      return NextResponse.json("Error fetching job postings", { status: 500 });
    }

    if (!jobPostings || jobPostings.length === 0) {
      console.log("No new job postings found.");
      return NextResponse.json("No new job postings found.");
    }

    // Extract job posting IDs for further querying
    const jobPostingIds = jobPostings.map((row) => row.id);
    console.log("🚀 ~ GET ~ jobPostingIds:", jobPostingIds);

    // Fetch job details for the filtered job postings
    const { data: jobPostingsDetails, error: detailsError } = await supabase
      .from("job_postings_details")
      .select(
        `
        *,
        job_postings (
          id,
          company_id,
          department,
          sub_department,
          type,
          role_title,
          location,
          posting_url,
          active,
          data,
          created_at,
          companies (company_name)
        )
        `
      )
      .in("job_posting_id", jobPostingIds);
    console.log("🚀 ~ GET ~ jobPostingsDetails:", jobPostingsDetails);

    if (detailsError) {
      console.error("Error fetching job postings details:", detailsError);
      return NextResponse.json("Error fetching job postings details", {
        status: 500,
      });
    }

    if (!jobPostingsDetails || jobPostingsDetails.length === 0) {
      console.log("No job postings details found.");
      return NextResponse.json("No job postings details found.");
    }

    // Format the data to match the schema
    const formattedData = jobPostingsDetails.map((row) => ({
      id: row.job_posting_id,
      company_id: row.job_postings.company_id,
      company_name: row.job_postings.companies.company_name,
      department: row.job_postings.department,
      sub_department: row.job_postings.sub_department,
      type: row.job_postings.type,
      role_title: row.job_postings.role_title,
      location: row.job_postings.location,
      posting_url: row.job_postings.posting_url,
      active: row.job_postings.active,
      data: row.job_postings.data,
      description: row.description,
      summary: row.summary,
      compensation: row.compensation,
    }));

    // Save filtered job postings to on-chain storage
    await saveDetailsOnchain(formattedData);

    console.log("Successfully saved details on-chain.");
    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

async function saveDetailsOnchain(jobs: any[]) {
  console.log("Creating attestation for job posting on-chain...");
  const account = mnemonicToAccount(process.env.ADMIN_MNEMONIC as string);
  const client = createWalletClient({
    account,
    chain:
      process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
        ? optimismSepolia
        : optimism,
    transport: http(),
  });

  const schemaEncoder = new SchemaEncoder(
    "uint256 id,uint256 created_at,uint256 company_id,string company_name,string department,string sub_department,string type,string role_title,string location,string posting_url,bool active,bytes data,string description,string summary,string compensation"
  );
  const encodedDataArray = [];
  for (const job of jobs) {
    const encodedData = schemaEncoder.encodeData([
      { name: "id", value: job.id, type: "uint256" },
      {
        name: "created_at",
        value: Math.floor(Date.now() / 1000),
        type: "uint256",
      },
      {
        name: "company_id",
        value: job.company_id,
        type: "uint256",
      },
      {
        name: "company_name",
        value: job.company_name || "",
        type: "string",
      },
      {
        name: "department",
        value: job.department || "",
        type: "string",
      },
      {
        name: "sub_department",
        value: job.sub_department || "N/A",
        type: "string",
      },
      { name: "type", value: job.type || "", type: "string" },
      {
        name: "role_title",
        value: job.role_title || "",
        type: "string",
      },
      { name: "location", value: job.location || "", type: "string" },
      {
        name: "posting_url",
        value: job.posting_url || "",
        type: "string",
      },
      { name: "active", value: job.active, type: "bool" },
      { name: "data", value: "0x", type: "bytes" },
      {
        name: "description",
        value: job.description || job.descriptionPlain || "N/A",
        type: "string",
      }, // todo: add description
      { name: "summary", value: job.summary || "", type: "string" }, // todo: add summary
      {
        name: "compensation",
        value: job.compensation || "N/A",
        type: "string",
      }, // todo: add compensation
    ]);

    encodedDataArray.push({
      recipient: process.env.ATTESTATION_RECIPIENT_ADDRESS as `0x${string}`,
      expirationTime: 0,
      revocable: true,
      refUID: "0x" + "00".repeat(32),
      data: encodedData,
      value: 0,
    });
  }

  // Attestation creation
  const contractParams = {
    address: process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS as `0x${string}`,
    abi: easAbi.abi,
    functionName: "multiAttest",
    args: [
      [
        {
          schema:
            process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
              ? process.env.NEXT_PUBLIC_SEPOLIA_JOB_SCHEMA_UID
              : process.env.NEXT_PUBLIC_JOB_SCHEMA_UID,
          data: encodedDataArray,
        },
      ],
    ],
    chain:
      process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
        ? optimismSepolia
        : optimism,
    account: client.account,
  };

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

    // console.log("Simulated contract request:", request);

    const txHash = await client.writeContract({
      ...request,
      account: client.account,
      nonce,
    });

    console.log("Attestation Transaction Hash:", txHash);
    // Wait for transaction to be mined
    await new Promise((resolve) => setTimeout(resolve, 12000));

    console.log("Retrieving attestation UID...");
    const uids = await getOnchainJobsUids(txHash);
    console.log("Attestation UID retrieved:", uids);

    console.log("Saving attestation UID to database...");
    // // Save attestation to database
    // for each uid in the uids array, save the uid to the database

    const uidToJobId = uids.map((uid, index) => ({
      uid,
      job_posting_id: jobs[index].id,
    }));

    await saveAttestations(uidToJobId, txHash);

    console.log("Attestation saved successfully.");
    return NextResponse.json("Success", { status: 200 });
  } catch (err) {
    console.error("Failed to create attestation:", err);
    throw new Error("Failed to create attestation");
  }
}

const saveAttestations = async (
  uidToJobId: { uid: string; job_posting_id: number }[],
  txHash: string
) => {
  const { data, error } = await supabase.from("job_attestations").insert(
    uidToJobId.map(({ uid, job_posting_id }) => ({
      attestation_uid: uid,
      attestation_tx_hash: txHash,
      job_posting_id,
    }))
  );

  if (error) {
    console.error("Error saving attestation to database:", error);
    throw new Error("Error saving attestation to database");
  }

  console.log("Attestation saved to database:", data);
};
