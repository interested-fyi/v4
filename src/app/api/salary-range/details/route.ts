import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // Query the `fetch_salary_details` function in Supabase
    const { data, error } = await supabase.rpc("fetch_salary_filters");
    console.log("🚀 ~ GET ~ error:", error);
    console.log("🚀 ~ GET ~ data:", data);

    // Handle any errors from the RPC call
    if (error) {
      throw new Error(`Error calling fetch_salary_details: ${error.message}`);
    }

    // If no data is returned, handle appropriately
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No salary details found.",
        },
        { status: 404 }
      );
    }

    // Return the salary details data
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
