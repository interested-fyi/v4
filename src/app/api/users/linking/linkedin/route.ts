import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function POST(req: NextRequest) {
  const { privy_did, email, name, vanity_name, subject } = await req.json();
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
    .from("linkedin_users")
    .upsert([{
        privy_did: privyDid,
        email: email,
        name: name,
        vanity_name: vanity_name,
        subject: subject
    }], { onConflict: 'email' })
    .select().single();

  if (error) throw error;

  return NextResponse.json(
    { linkedin_user: data },
    { status: 200 }
  );
}