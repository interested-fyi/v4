import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { toCamelCase } from "@/lib/utils";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("privy_did, name, photo_source, total_points")
      .order("total_points", { ascending: false })
      .limit(10); // Adjust the limit if needed

    if (error) {
      throw error;
    }
    const transformedData = data.map(toCamelCase);
    return NextResponse.json({ users: transformedData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching top users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
