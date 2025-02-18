import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // First, get ALL job postings that need attestation
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
      .neq("job_attestations", null) // This filters for rows where job_attestations is null
      .limit(5);
    if (jobPostingsError) {
      console.error("Error fetching job postings:", jobPostingsError);
      return NextResponse.json("Error fetching job postings", { status: 500 });
    }

    // Filter out jobs that already have attestations
    const unattested_jobs = jobPostings.filter(
      (job) => !job.job_attestations || job.job_attestations.length === 0
    );

    if (!unattested_jobs || unattested_jobs.length === 0) {
      console.log("No new unattested job postings found.");
      return NextResponse.json("No new job postings found.");
    }

    // Extract job posting IDs for further querying
    const jobPostingIds = unattested_jobs.map((job) => job.id);

    // Fetch job details for the filtered job postings
    const { data: jobPostingsDetails, error: detailsError } = await supabase
      .from("job_postings_details")
      .select(
        `
        *,
        job_postings!inner (
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
          companies!inner (
            company_name
          )
        )
      `
      )
      .in("job_posting_id", jobPostingIds);

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

    // Double-check no attestations exist before proceeding
    const { data: existingAttestations, error: checkError } = await supabase
      .from("job_attestations")
      .select("job_posting_id")
      .in("job_posting_id", jobPostingIds);
    if (checkError) {
      console.error("Error checking existing attestations:", checkError);
      return NextResponse.json("Error checking attestations", { status: 500 });
    }
    let jobPostingsDetailsFiltered = [];
    if (existingAttestations && existingAttestations.length > 0) {
      console.log("Found conflicting attestations, skipping these jobs");
      const existingIds = new Set(
        existingAttestations.map((a) => a.job_posting_id)
      );
      jobPostingsDetailsFiltered = jobPostingsDetails.filter(
        (job) => !existingIds.has(job.job_posting_id)
      );

      if (jobPostingsDetails.length === 0) {
        return NextResponse.json("All jobs already attested");
      }
    }

    // Format the data to match the schema
    const formattedData = jobPostingsDetailsFiltered.map((row) => ({
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
    if (jobPostingsError) {
      console.error("Error fetching job postings:", jobPostingsError);
      return NextResponse.json("Error fetching job postings", { status: 500 });
    }
    if (!jobPostings || jobPostings.length === 0) {
      console.log("No new job postings found.");
      return NextResponse.json("No new job postings found.");
    }

    return NextResponse.json({ jobPostings });
  } catch (e) {
    return NextResponse.json(
      { error: `Error Fetching Users: ${e}` },
      { status: 500 }
    );
  }
}
