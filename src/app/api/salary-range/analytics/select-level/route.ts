import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { level, geography, code, privy_did } = await req.json();
    const { data, error } = await supabase
      .from("salary_range_analytics")
      .upsert([
        {
          level: level,
          geography: geography,
          code: code,
          privy_did: privy_did,
        },
      ]);
    console.log("🚀 ~ POST ~ data:", data);

    console.log("🚀 ~ POST ~ error:", error);
    if (error) {
      throw new Error(`Error: ${error.message}`);
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
        message: `Error: ${e.message}`,
      },
      { status: 500 }
    );
  }
}
