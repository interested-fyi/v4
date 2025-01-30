import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

interface UserProfile {
  privy_did: string;
  available: boolean;
  position: string[];
  [key: string]: any;
}

interface FetchTalentResponse {
  success: boolean;
  users: (UserProfile & { attestation_count: number })[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const filter = url.searchParams.get("filter") || "";

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit - 1;

    let query = supabase
      .from("user_profile_combined")
      .select("*")
      .eq("available", true)
      .order("created_at", { ascending: true }) // Ensure consistent ordering
      .range(startIndex, endIndex);

    if (filter) {
      query = query.contains("position", [filter]);
    }

    const { data: userData, error: userError } = await query;

    if (userError || !userData) {
      throw new Error(`Error fetching user data: ${userError?.message}`);
    }

    // Batch query for attestation counts
    const { data: attestations, error: attestationsError } = await supabase
      .from("attestations")
      .select("recipient")
      .in(
        "recipient",
        userData.map((user) => user.privy_did)
      );

    if (attestationsError) {
      throw new Error(
        `Error fetching attestation counts: ${attestationsError.message}`
      );
    }

    // Create a count map for attestations
    const attestationCountMap = new Map<string, number>();
    attestations?.forEach((attestation) => {
      const recipient = attestation.recipient;
      attestationCountMap.set(
        recipient,
        (attestationCountMap.get(recipient) || 0) + 1
      );
    });

    // Map attestation counts back to user data
    const usersWithAttestations = userData.map((user) => ({
      ...user,
      attestation_count: attestationCountMap.get(user.privy_did) || 0,
    }));

    const { count: totalUsers, error: countError } = await supabase
      .from("user_profile_combined")
      .select("privy_did", { count: "exact" })
      .eq("available", true);

    if (countError) {
      throw new Error(`Error counting users: ${countError.message}`);
    }

    return NextResponse.json<FetchTalentResponse>({
      success: true,
      users: usersWithAttestations,
      totalUsers: totalUsers || 0,
      currentPage: page,
      totalPages: totalUsers ? Math.ceil(totalUsers / limit) : 0,
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Error Fetching Users: ${e}` },
      { status: 500 }
    );
  }
}
