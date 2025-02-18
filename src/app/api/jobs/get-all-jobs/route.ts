import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import JobPosting from "@/types/job-posting";

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const department = url.searchParams.get("department") || "";
    const roleTitle = url.searchParams.get("title") || "";
    const location = url.searchParams.get("location") || "";
    const sortBy = url.searchParams.get("sortBy") || "created_at";

    // Calculate start index for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    // Build the query
    let query = supabase
      .from("job_postings")
      .select(
        `
        id,
        company_id,
        role_title,
        location,
        posting_url,
        department,
        created_at,
        active,
        companies!inner(company_name),
        job_attestations (
          attestation_uid,
          attestation_tx_hash,
          created_at
        )
      `,
        { count: "exact" } // Get total job count
      )
      .eq("active", true)
      .order(sortBy, { ascending: false }) // Sorting
      .range(startIndex, endIndex); // Pagination in SQL

    // Apply filters
    if (department) query = query.ilike("department", `%${department}%`);
    if (roleTitle) query = query.ilike("role_title", `%${roleTitle}%`);
    if (location) query = query.ilike("location", `%${location}%`);

    // Execute the query
    const { data: jobs, error, count } = await query;
    if (error) throw new Error(`Error fetching jobs: ${error.message}`);

    return NextResponse.json({
      success: true,
      jobs,
      totalJobs: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
