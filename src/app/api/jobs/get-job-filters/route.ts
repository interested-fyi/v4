import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // Call the Supabase function to fetch filters
    const { data, error } = await supabase.rpc("fetch_filters");

    if (error) {
      throw new Error(`Error fetching filters: ${error.message}`);
    }

    // Format the data and ensure alphabetical order
    const filters = {
      roleTitles: Array.from(
        new Set(data.map((item: any) => item.role_title).filter(Boolean))
      ).sort(),
      locations: Array.from(
        new Set(data.map((item: any) => item.location).filter(Boolean))
      ).sort(),
      departments: Array.from(
        new Set(data.map((item: any) => item.department).filter(Boolean))
      ).sort(),
    };

    return NextResponse.json(
      {
        success: true,
        roleTitles: filters.roleTitles,
        locations: filters.locations,
        departments: filters.departments,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: `Error fetching filters: ${e.message}` },
      { status: 500 }
    );
  }
}
