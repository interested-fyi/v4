import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function POST(req: NextRequest) {
  const { attestation_uid, attestation_tx_hash, recipient, recipient_address, endorser, endorser_address, relationship, endorsement, privy_did } = await req.json();
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
    .from("attestations")
    .upsert([{
        attestation_uid: attestation_uid,
        attestation_tx_hash: attestation_tx_hash,
        recipient: recipient,
        recipient_address: recipient_address,
        endorser: endorser,
        endorser_address: endorser_address,
        relationship: relationship,
        endorsement: endorsement
    }], { onConflict: 'attestation_uid' })
    .select().single();

  if (error) throw error;

  return NextResponse.json(
    { success: true, attestation: data },
    { status: 200 }
  );
}