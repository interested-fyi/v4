import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import JobPosting from "@/types/job-posting";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Get page and limit from query parameters, with default values
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Calculate the starting index
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Fetch approved companies with their job postings
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select(
        `
          id,
          company_name,
          job_postings ( id, company_id, role_title, location, posting_url, department, created_at, active, job_attestations ( attestation_uid, attestation_tx_hash ) )
        `
      )
      .eq("approved", true);

    if (companyError) {
      throw new Error(`Error fetching company data: ${companyError.message}`);
    }

    // Extract all job postings from approved companies
    let allJobs: JobPosting[] = companyData.reduce(
      (acc: JobPosting[], company) => {
        return acc.concat(
          company.job_postings.map((job) => ({
            ...job,
            company_name: company.company_name,
          }))
        );
      },
      []
    );

    // Apply pagination to the extracted jobs
    const paginatedJobs = allJobs.slice(startIndex, endIndex);

    // Return paginated jobs with metadata
    return NextResponse.json(
      {
        success: true,
        jobs: paginatedJobs,
        totalJobs: allJobs.length,
        currentPage: page,
        totalPages: Math.ceil(allJobs.length / limit),
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(`Error Fetching Jobs: ${e}`, {
      status: 500,
    });
  }
}
