import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function DELETE(req: NextRequest) {
  const { privy_did } = await req.json();
  const accessToken = req.headers.get("Authorization")?.replace("Bearer ", "");

  // verify authenticate user sent request
  let privyDid;
  try {
    const verified = await privyClient.verifyAuthToken(accessToken!);
    privyDid = verified.userId;
    if (privy_did !== privyDid) {
      throw new Error("Privy DIDs do not match");
    }
  } catch (e) {
    throw new Error("Invalid access token");
  }

  const { data, error } = await supabase
    .from("farcaster_users")
    .delete()
    .match({ privy_did: privyDid });

  if (error) throw error;

  return NextResponse.json({ farcaster_user: data }, { status: 200 });
}
