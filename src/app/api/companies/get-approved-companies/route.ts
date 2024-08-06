import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

interface JobPosting {
  id: number;
}

export interface CompanyResponse {
  approved: boolean;
  name: string;
  id: number;
  careersPageURL: string;
  creatorEmail: string;
  creatorFID: number;
  creatorPrivyDID: string;
  denied: boolean;
  createdAt: string;
  jobPostings: JobPosting[];
  jobCount: number;
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Get approved companies and count of jobs for each company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select(
        `
                *,
                job_postings ( id )
            `
      )
      .eq("approved", true);

    if (companyError) {
      throw new Error(`Error fetching company data: ${companyError}`);
    }

    // Calculate the count of jobs for each company
    const companiesWithJobCount: CompanyResponse[] = companyData.map(
      (company) => ({
        approved: company.approved,
        name: company.company_name,
        id: company.id,
        careersPageURL: company.careers_page_url,
        creatorEmail: company.creator_email,
        creatorFID: company.creator_fid,
        creatorPrivyDID: company.creator_privy_did,
        denied: company.denied,
        createdAt: company.created_at,
        jobPostings: company.job_postings,
        jobCount: company.job_postings.length,
      })
    );

    return NextResponse.json(
      { success: true, companies: companiesWithJobCount },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(`Error Fetching Companies: ${e}`, { status: 401 });
  }
}
