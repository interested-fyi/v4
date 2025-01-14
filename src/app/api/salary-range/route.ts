import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Get the `lookup_value` and `level` from query parameters
    const url = new URL(req.url);
    const countryCode = url.searchParams.get("country_code");
    const jobProfile = url.searchParams.get("job_profile");

    // Validate input
    if (!countryCode || !jobProfile) {
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
      .select("new_min, new_mid, new_max, currency")
      .eq("geography", countryCode)
      .eq("job_profile", jobProfile);
    console.log("🚀 ~ GET ~ data:", data);

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
      { success: true, salaryRange: data[0] },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: `Error fetching salary range: ${e.message}` },
      { status: 500 }
    );
  }
}
