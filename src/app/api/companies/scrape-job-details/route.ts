import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import easAbi from "@ethereum-attestation-service/eas-contracts/deployments/optimism/EAS.json";
import extractJobData from "@/functions/job-scraping/description_scraper/ai-description-scraper";
import generateSummary from "@/functions/job-scraping/description_scraper/generate-summary";
import { mnemonicToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { optimism, optimismSepolia } from "viem/chains";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { publicClient } from "@/lib/viemClient";
import { getEndorsementUid } from "@/functions/general/get-endorsement-uid";

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("Incoming request to scrape job details...");

  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.log("Unauthorized request. Authorization header does not match.");
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const { posting, isNewJob } = await req.json();

  try {
    if (posting.type === "ashby") {
      console.log("Detected Ashby job posting...");
      if (posting.data && posting.data.descriptionPlain && posting.data.title) {
        console.log("Generating job summary...");
        const summary = await generateSummary(posting.data.descriptionPlain);

        console.log("Updating job details in Supabase...");
        const { data, error: detailsError } = await supabase.rpc(
          "update_job_details_and_scraping",
          {
            p_job_posting_id: posting.id,
            p_description: posting.data.descriptionPlain,
            p_summary: summary?.content,
            p_compensation: posting.data.compensation?.compensationTierSummary,
            p_title: posting.data.title,
            p_location: `${posting.data.location}${
              posting.data.secondaryLocations.length > 0
                ? ", " +
                  posting.data.secondaryLocations
                    .map((location: any) => location.location)
                    .join(", ")
                : ""
            }`,
          }
        );

        if (detailsError) {
          console.error(
            `Error updating job details in Supabase for ${posting.posting_url} (${posting.id}):`,
            detailsError
          );
          throw new Error(detailsError.message);
        }

        console.log("Job details updated successfully:", data);

        if (isNewJob) {
          console.log(
            "New job detected. Proceeding to save details on-chain..."
          );
          await setTimeout(async () => {
            await saveDetailsOnchain({
              ...posting,
              compensation: posting.data.compensation?.compensationTierSummary,
              location: `${posting.data.location}${
                posting.data.secondaryLocations.length > 0
                  ? ", " +
                    posting.data.secondaryLocations
                      .map((location: any) => location.location)
                      .join(", ")
                  : ""
              }`,
              summary: summary?.content,
              description: posting.data.descriptionPlain,
            });
          }, 5000);
        }

        return NextResponse.json(
          { success: true, ids: data?.[0] },
          { status: 200 }
        );
      } else {
        console.warn(
          "Job details are incomplete. Missing required fields.",
          posting
        );
        throw new Error(
          `Job Details Not Complete: ${posting.posting_url} (${posting.id})`
        );
      }
    }

    console.log("Scraping job data from URL:", posting.posting_url);
    const jobData = await extractJobData(posting.posting_url);

    if (!jobData) {
      console.warn(
        "Job scraping failed. No data returned for URL:",
        posting.posting_url
      );
      throw new Error(
        `Failed to scrape and parse job details for: ${posting.posting_url} (${posting.id})`
      );
    }

    const enrichedData = jobData?.content;
    console.log("Scraped job data successfully:", enrichedData);

    if (enrichedData && enrichedData.description && enrichedData.title) {
      console.log("Saving enriched job details to Supabase...");
      const { data, error: detailsError } = await supabase.rpc(
        "update_job_details_and_scraping",
        {
          p_job_posting_id: posting.id,
          p_description: enrichedData.description,
          p_summary: enrichedData.summary,
          p_compensation: enrichedData.compensation,
          p_title: enrichedData.title,
          p_location: enrichedData.location,
        }
      );

      if (detailsError) {
        console.error(
          `Error updating job details in Supabase for ${posting.posting_url} (${posting.id}):`,
          detailsError
        );
        throw new Error(detailsError.message);
      }

      console.log("Job details updated successfully:", data);

      if (isNewJob) {
        console.log("New job detected. Proceeding to save details on-chain...");
        try {
          await setTimeout(
            async () =>
              await saveDetailsOnchain({
                ...posting,
                compensation: enrichedData.compensation,
                location: enrichedData.location,
                summary: enrichedData.summary,
                description: enrichedData.description,
              }),
            5000
          );
        } catch (e) {
          console.error("Error while saving job details on-chain:", e);
        }
      }

      return NextResponse.json(
        { success: true, ids: data?.[0] },
        { status: 200 }
      );
    } else {
      console.warn("Enriched job details are incomplete.", enrichedData);
      throw new Error(
        `Job Details Not Complete: ${posting.posting_url} (${posting.id})`
      );
    }
  } catch (e) {
    console.error("Error processing job posting:", e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

async function saveDetailsOnchain(job: any) {
  console.log("🚀 ~ saveDetailsOnchain ~ job:", job);
  console.log("Creating attestation for job posting on-chain...");
  const account = mnemonicToAccount(process.env.ADMIN_MNEMONIC as string);
  const client = createWalletClient({
    account,
    chain:
      process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
        ? optimismSepolia
        : optimism,
    transport: http(
      "https://opt-sepolia.g.alchemy.com/v2/5VkHc9C6C81ouetdMCY5jawJzHELtDaQ"
    ),
  });

  const schemaEncoder = new SchemaEncoder(
    "uint256 id,uint256 created_at,uint256 company_id,string company_name,string department,string sub_department,string type,string role_title,string location,string posting_url,bool active,bytes data,string description,string summary,string compensation"
  );

  const encodedData = schemaEncoder.encodeData([
    { name: "id", value: job.id?.toString(), type: "uint256" },
    {
      name: "created_at",
      value: Math.floor(Date.now() / 1000).toString(),
      type: "uint256",
    },
    {
      name: "company_id",
      value: job.company_id?.toString(),
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
      value: job.sub_department || "",
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
    { name: "description", value: job.description || "", type: "string" }, // todo: add description
    { name: "summary", value: job.summary || "", type: "string" }, // todo: add summary
    { name: "compensation", value: job.compensation || "", type: "string" }, // todo: add compensation
  ]);

  // Attestation creation
  const contractParams = {
    address: process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS as `0x${string}`,
    abi: easAbi.abi,
    functionName: "attest",
    args: [
      {
        schema:
          process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
            ? process.env.NEXT_PUBLIC_SEPOLIA_JOB_SCHEMA_UID
            : process.env.NEXT_PUBLIC_JOB_SCHEMA_UID,
        data: {
          recipient: process.env.ATTESTATION_RECIPIENT_ADDRESS as `0x${string}`,
          expirationTime: 0,
          revocable: true,
          refUID: "0x" + "00".repeat(32),
          data: encodedData,
          value: 0,
        },
      },
    ],
    chain:
      process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
        ? optimismSepolia
        : optimism,
    account: client.account.address,
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
    const { request } = await publicClient.simulateContract(contractParams);
    // console.log("Simulated contract request:", request);

    const txHash = await client.writeContract({
      ...request,
      account: client.account,
    });

    console.log("Attestation Transaction Hash:", txHash);
    // Wait for transaction to be mined
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Retrieving attestation UID...");
    const uid = await getEndorsementUid(txHash);
    console.log("Attestation UID retrieved:", uid);

    console.log("Saving attestation UID to database...");
    // Save attestation to database
    await supabase.from("job_attestations").insert({
      attestation_uid: uid,
      job_id: job.id,
      recipient: process.env.ATTESTATION_RECIPIENT_ADDRESS,
    });

    console.log("Attestation saved successfully.");
  } catch (err) {
    console.error("Failed to create attestation:");
  }
}
