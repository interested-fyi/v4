import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Get page and limit from query parameters, with default values
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Calculate the starting index
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Fetch users where 'available' is TRUE
    const { data: userData, error: userError } = await supabase
      .from("user_profile_combined")
      .select("*")
      .eq("available", true)
      .range(startIndex, endIndex - 1); // Pagination with range

    if (userError) {
      throw new Error(`Error fetching user data: ${userError.message}`);
    }

    // Count the total number of available users
    const { count: totalUsers, error: countError } = await supabase
      .from("user_profile_combined")
      .select("privy_did", { count: "exact" })
      .eq("available", true);

    if (countError) {
      throw new Error(`Error counting users: ${countError.message}`);
    }

    // Return paginated users with metadata
    return NextResponse.json(
      {
        success: true,
        users: userData,
        totalUsers,
        currentPage: page,
        totalPages: totalUsers ? Math.ceil(totalUsers / limit) : 0,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(`Error Fetching Users: ${e}`, { status: 401 });
  }
}
