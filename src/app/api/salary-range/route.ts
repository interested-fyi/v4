import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Get the `lookup_value` and `level` from query parameters
    const url = new URL(req.url);
    const countryCode = url.searchParams.get("country_code");
    const jobCode = url.searchParams.get("job_code");
    const privyDid = url.searchParams.get("privy_did");

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
    console.log("🚀 ~ GET ~ data:", data);

    // log the event to the analytics table
    const { data: logData, error: logError } = await supabase
      .from("salary_lookup_analytics")
      .insert([
        {
          geography: countryCode,
          code: jobCode,
          privy_did: privyDid,
        },
      ]);
    console.log("🚀 ~ GET ~ logError:", logError);
    console.log("🚀 ~ GET ~ logData:", logData);

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
