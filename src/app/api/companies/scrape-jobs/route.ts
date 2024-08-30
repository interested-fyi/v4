import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { AuthTokenClaims, PrivyClient } from "@privy-io/server-auth";
import User from "@/types/user";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function POST(req: NextRequest, res: NextResponse) {
  const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (authToken === process.env.CRON_SECRET) {
    return handleRequest(req);
  }

  try {
    if (!authToken) {
      return NextResponse.json(`Unauthorized`, { status: 401 });
    }

    let verificationClaim: AuthTokenClaims;
    try {
      verificationClaim = await privyClient.verifyAuthToken(authToken!);
    } catch (e) {
      return NextResponse.json(`Unauthorized: ${e}`, { status: 401 });
    }

    // get user and check if is admin
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
    if (!user || !user.is_admin) {
      return NextResponse.json("User is not an admin", { status: 403 });
    }

    return handleRequest(req);
  } catch (e) {
    return NextResponse.json(`Error: ${e}`, { status: 500 });
  }
}

async function handleRequest(req: NextRequest) {
  try {
    const { url, company_id } = await req.json();
    let jobPostings;

    if (url.includes("greenhouse")) {
      const { default: greenhouseScraper } = await import(
        "@/functions/job-scraping/greenhouse/greenhouse-scraper"
      );
      jobPostings = await greenhouseScraper(url, company_id);
    } else if (url.includes("lever")) {
      const { default: leverScraper } = await import(
        "@/functions/job-scraping/lever/lever-scraper"
      );
      jobPostings = await leverScraper(url, company_id);
    } else {
      return NextResponse.json({ error: "Unsupported URL" }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, job_postings: jobPostings },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: `Error scraping jobs: ${e.message}` },
      { status: 500 }
    );
  }
}
