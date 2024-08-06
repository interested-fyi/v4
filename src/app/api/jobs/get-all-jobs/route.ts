import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";
import JobPosting from "@/types/job-posting";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Get approved companies and their job postings
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select(
        `
          id,
          company_name,
          job_postings ( id, company_id, role_title, location, posting_url, department, created_at, active )
        `
      )
      .eq("approved", true);

    if (companyError) {
      throw new Error(`Error fetching company data: ${companyError}`);
    }

    // Extract all job postings from approved companies
    const allJobs: JobPosting[] = companyData.reduce(
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

    return NextResponse.json({ success: true, jobs: allJobs }, { status: 200 });
  } catch (e) {
    return NextResponse.json(`Error Fetching Jobs: ${e}`, { status: 401 });
  }
}
