import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);
export async function POST(req: NextRequest) {
  try {
    const { level, geography, code, privy_did } = await req.json();

    const accessToken = req.headers
      .get("Authorization")
      ?.replace("Bearer ", "");
    // Verify and authenticate the user
    const verified = await privyClient.verifyAuthToken(accessToken!);
    const privyDid = verified.userId;
    if (privy_did !== privyDid) {
      throw new Error("Privy DIDs do not match");
    }
    const { data, error } = await supabase
      .from("salary_range_analytics")
      .insert([
        {
          level: level,
          geography: geography,
          code: code,
          privy_did: privy_did,
        },
      ]);

    if (error) {
      throw new Error(`Error calling fetch_salary_details: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        salaryDetails: data,
      },
      { status: 200 }
    );
  } catch (e: any) {
    // Handle any unexpected errors
    return NextResponse.json(
      {
        success: false,
        message: `Error fetching salary details: ${e.message}`,
      },
      { status: 500 }
    );
  }
}
