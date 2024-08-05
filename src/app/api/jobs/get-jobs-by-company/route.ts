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
