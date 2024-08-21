import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import JobPosting from "@/types/job-posting";

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json(
      { success: false, error: "Company ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get job postings for the specified company ID
    const { data: jobData, error: jobError } = await supabase
      .from("job_postings")
      .select("*")
      .eq("company_id", companyId)
      .returns<JobPosting[]>();

    if (jobError) {
      throw new Error(
        `Error fetching job postings for the company: ${jobError}`
      );
    }

    return NextResponse.json({ success: true, jobs: jobData }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: `Error fetching jobs: ${e.message}` },
      { status: 401 }
    );
  }
}
