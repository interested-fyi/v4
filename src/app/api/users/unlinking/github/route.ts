import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function DELETE(req: NextRequest) {
  try {
    const { privy_did } = await req.json();
    const accessToken = req.headers
      .get("Authorization")
      ?.replace("Bearer ", "");
    // Verify and authenticate the user
    const verified = await privyClient.verifyAuthToken(accessToken!);
    const privyDid = verified.userId;
    if (privy_did !== privyDid) {
      throw new Error("Privy DIDs do not match");
    }

    // Delete row in Supabase
    const { data, error } = await supabase
      .from("github_users")
      .delete()
      .match({ privy_did });
    if (error) {
      throw error;
    }

    return NextResponse.json({ github_user: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 400 }
    );
  }
}
