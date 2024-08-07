import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

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
    // Get company information
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select(
        `
          *,
          job_postings ( id, company_id, role_title, location, posting_url, created_at, active )
        `
      )
      .eq("id", companyId)
      .single();

    if (companyError) {
      throw new Error(`Error fetching company data: ${companyError}`);
    }

    const companyResponse = {
      approved: companyData.approved,
      name: companyData.company_name,
      id: companyData.id,
      location: companyData.location,
      careersPageURL: companyData.careers_page_url,
      creatorEmail: companyData.creator_email,
      creatorFID: companyData.creator_fid,
      creatorPrivyDID: companyData.creator_privy_did,
      denied: companyData.denied,
      createdAt: companyData.created_at,
      jobPostings: companyData.job_postings,
      jobCount: companyData.job_postings.length,
    };

    return NextResponse.json(
      { success: true, company: companyResponse },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: `Error fetching company info: ${e.message}` },
      { status: 401 }
    );
  }
}
