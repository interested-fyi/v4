import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Get the `lookup_value` and `level` from query parameters

    const { countryCode, jobCode, privy_did } = await req.json();
    const accessToken = req.headers
      .get("Authorization")
      ?.replace("Bearer ", "");
    // Verify and authenticate the user
    const verified = await privyClient.verifyAuthToken(accessToken!);
    const privyDid = verified.userId;
    if (privy_did !== privyDid) {
      throw new Error("Privy DIDs do not match");
    }
    // Validate input
    if (!countryCode || !jobCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Both 'lookup_value' and 'level' are required.",
        },
        { status: 400 }
      );
    }

    // Query Supabase for the salary range based on lookup_value and level
    const { data, error } = await supabase
      .from("salary_ranges")
      .select("new_min, new_mid, new_max, currency, level, job_profile")
      .eq("geography", countryCode)
      .eq("job_code", jobCode);

    // log the event to the analytics table
    await supabase.from("salary_lookup_analytics").insert([
      {
        geography: countryCode,
        code: jobCode,
        privy_did: privyDid,
      },
    ]);

    // Handle any query errors
    if (error) {
      throw new Error(`Error fetching salary range: ${error.message}`);
    }

    // If no data is found, return an appropriate message
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No salary range found for the specified criteria.",
        },
        { status: 404 }
      );
    }

    // Return the salary range data
    return NextResponse.json(
      { success: true, salaryRange: data },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: `Error fetching salary range: ${e.message}` },
      { status: 500 }
    );
  }
}
