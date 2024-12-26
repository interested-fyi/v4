import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { privyDid: string } }
) {
  const { privyDid: privy_did } = params;
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
  console.log(privyDid);
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("privy_did", privyDid)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      profile: {
        ...data,
      },
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const { privyDid: privy_did, preferredProfile } = await req.json();

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
  const { data, error } = await supabase.from("user_profiles").upsert(
    {
      preferred_profile: preferredProfile ?? null,
      privy_did: privyDid,
    },
    { onConflict: "privy_did" }
  );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
