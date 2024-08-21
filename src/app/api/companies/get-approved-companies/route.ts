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
    // Extract page and limit from query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Calculate the starting point for pagination
    const offset = (page - 1) * limit;

    // Get approved companies with pagination and count of jobs for each company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select(
        `
          *,
          job_postings ( id )
        `
      )
      .eq("approved", true)
      .range(offset, offset + limit - 1); // Apply pagination using range

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

    // Get the total number of approved companies
    const { count: totalCompanies, error: countError } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true })
      .eq("approved", true);

    if (countError) {
      throw new Error(`Error fetching companies count: ${countError}`);
    }

    const totalPages = Math.ceil((totalCompanies || 0) / limit);

    return NextResponse.json(
      {
        success: true,
        companies: companiesWithJobCount,
        totalCompanies,
        currentPage: page,
        totalPages,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(`Error Fetching Companies: ${e}`, { status: 401 });
  }
}
