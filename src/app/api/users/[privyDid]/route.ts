import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { privyDid: string } }
) {
  const { privyDid } = params;
  const { data, error } = await supabase
    .from("user_profile_combined")
    .select(
      "available, bio, created_at, degen_score, email, employment_type, farcaster_name, farcaster_fid, geography, github_username, linkedin_name, name, photo_source, position, preferred_photo, preferred_profile, privy_did, telegram_photo, telegram_user_id, telegram_username, wallet_addresses, x_photo, x_username"
    )
    .eq("privy_did", `did:privy:${privyDid}`)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, profile: data }, { status: 200 });
}
