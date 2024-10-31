import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const filter = url.searchParams.get("filter"); // position filter

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build the query
    let query = supabase
      .from("user_profile_combined")
      .select("*")
      .eq("available", true)
      .range(startIndex, endIndex - 1);

    // Apply the filter if provided
    if (filter) {
      query = query.contains("position", [filter]); // Checks if the position array contains the filter string
    }

    // Fetch users
    const { data: userData, error: userError } = await query;

    if (userError) {
      throw new Error(`Error fetching user data: ${userError.message}`);
    }

    // Fetch attestation count for each user
    const usersWithAttestations = await Promise.all(
      userData.map(async (user) => {
        const { count: attestationCount, error: attestationError } =
          await supabase
            .from("attestations")
            .select("*", { count: "exact" })
            .eq("recipient", user.privy_did);

        if (attestationError) {
          throw new Error(
            `Error fetching attestation count: ${attestationError.message}`
          );
        }

        return {
          ...user,
          attestation_count: attestationCount || 0, // Add the count of attestations
          nextCursor: page + 1,
        };
      })
    );

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
        users: usersWithAttestations,
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
