import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function POST(req: NextRequest) {
  const { privy_did, email, name, subject } = await req.json();
  const accessToken = req.headers.get("Authorization")?.replace("Bearer ", "");

  // verify authenticate user sent request
  let privyDid;
  try {
    const verified = await privyClient.verifyAuthToken(accessToken!);
    privyDid = verified.userId;
    if (privy_did !== privyDid) {
        throw new Error('Privy DIDs do not match');
    }
  } catch (e) {
    throw new Error("Invalid access token");
  }

  const { data, error } = await supabase
    .from("users")
    .upsert([{
        privy_did: privyDid,
        email: email,
    }], { onConflict: 'privy_did' })
    .select().single();

  if (error) throw error;

  const { data: googleData, error: googleError } = await supabase
    .from("google_users")
    .upsert([{
        privy_did: privyDid,
        email: email,
        name: name,
        subject: subject
    }], { onConflict: 'privy_did' })
    .select().single();

  if (googleError) throw googleError;

  return NextResponse.json(
    { user: data, google_user: googleData },
    { status: 200 }
  );
}