import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import JobPosting from "@/types/job-posting";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const department = url.searchParams.get("department") || "";
    const roleTitle = url.searchParams.get("title") || "";
    const location = url.searchParams.get("location") || "";
    const sortBy = url.searchParams.get("sortBy") || "created_at"; // Default sorting by created_at

    // Calculate start index for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build the query
    let query = supabase
      .from("companies")
      .select(
        `
          id,
          company_name,
          job_postings ( id, company_id, role_title, location, posting_url, department, created_at, active, job_attestations ( attestation_uid, attestation_tx_hash, created_at) )
        `
      )
      .eq("approved", true)
      .eq("job_postings.active", true)
      .order("created_at", { ascending: false });

    // Apply filters
    if (department)
      query = query.ilike("job_postings.department", `%${department}%`);
    if (roleTitle)
      query = query.ilike("job_postings.role_title", `%${roleTitle}%`);
    if (location) query = query.ilike("job_postings.location", `%${location}%`);

    // Apply sorting
    query = query.order(sortBy, { ascending: true });

    // Execute the query
    const { data: companyData, error: companyError } = await query;

    if (companyError) {
      throw new Error(`Error fetching company data: ${companyError.message}`);
    }

    // Flatten the job postings and paginate
    let allJobs: JobPosting[] = companyData.reduce(
      (acc: JobPosting[], company) => acc.concat(company.job_postings),
      []
    );
    const paginatedJobs = allJobs.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      jobs: paginatedJobs,
      totalJobs: allJobs.length,
      totalPages: Math.ceil(allJobs.length / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
