import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function POST(req: NextRequest) {
  const {
    privy_did,
    name,
    photo_source,
    available,
    preferred_profile,
    bio,
    position,
    calendly_link,
    unlock_calendar_fee,
    booking_description,
    smart_wallet_address,
  } = await req.json();
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

  let preferredProfile;

  if (preferred_profile === "twitter") {
    preferredProfile = "x";
  } else {
    preferredProfile = preferred_profile;
  }

  const profileData = {
    privy_did: privyDid,
    name: name,
    photo_source: photo_source,
    available: available,
    preferred_profile: preferredProfile,
    bio: bio,
    position: position,
    calendly_link: calendly_link,
    unlock_calendar_fee: unlock_calendar_fee,
    booking_description: booking_description,
    smart_wallet_address: smart_wallet_address,
  };
  const filteredProfileData = Object.fromEntries(
    Object.entries(profileData).filter(([_, value]) => value !== undefined)
  );
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      [filteredProfileData],
      { onConflict: "privy_did" }
    )
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({ profile: data, success: true }, { status: 200 });
}
