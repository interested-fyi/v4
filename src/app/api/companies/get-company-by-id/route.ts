import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";
import User from "@/types/user";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function GET(req: NextRequest, res: NextResponse) {
  const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  const url = new URL(req.url);
  const companyId = url.searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json(
      { success: false, error: "Company ID is required" },
      { status: 400 }
    );
  }

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
