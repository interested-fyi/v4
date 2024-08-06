import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";
import User from "@/types/user";

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

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function GET(req: NextRequest, res: NextResponse) {
  const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  try {
    const verificationClaim = await privyClient.verifyAuthToken(authToken!);

    // Get user and check if they are an admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select()
      .eq("privy_did", verificationClaim.userId)
      .returns<User[]>();

    if (userError) {
      throw new Error(
        `Error fetching user for the supplied auth token: ${userError}`
      );
    }

    const user = userData?.[0];
    if (!user.is_admin) {
      throw new Error("User is not an admin");
    }

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
