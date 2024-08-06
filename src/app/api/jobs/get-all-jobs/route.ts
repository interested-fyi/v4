import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";
import User from "@/types/user";
import JobPosting from "@/types/job-posting";

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
