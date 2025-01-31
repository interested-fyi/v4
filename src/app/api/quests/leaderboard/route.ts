import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { toCamelCase } from "@/lib/utils";
import { PrivyClient } from "@privy-io/server-auth";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function GET(request: NextRequest, privyDid: string) {
  try {
    const accessToken = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");
    // Verify and authenticate the user
    const verified = await privyClient.verifyAuthToken(accessToken!);
    const privy_did = verified.userId;
    if (privy_did !== privyDid) {
      throw new Error("Privy DIDs do not match");
    }

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
