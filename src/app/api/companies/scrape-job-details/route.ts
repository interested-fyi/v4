import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import extractJobData from "@/functions/job-scraping/description_scraper/ai-description-scraper";
import generateSummary from "@/functions/job-scraping/description_scraper/generate-summary";

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("Incoming request to scrape job details...");

  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.log("Unauthorized request. Authorization header does not match.");
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const { posting } = await req.json();

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

        return NextResponse.json({ success: true }, { status: 200 });
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

      return NextResponse.json({ success: true }, { status: 200 });
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
