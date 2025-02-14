import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function DELETE(req: NextRequest) {
  try {
    const { privy_did, address_to_remove } = await req.json();
    const accessToken = req.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    // Verify and authenticate the user
    const verified = await privyClient.verifyAuthToken(accessToken!);
    const privyDid = verified.userId;
    if (privy_did !== privyDid) {
      throw new Error("Privy DIDs do not match");
    }

    // Delete the wallet address row where privy_did and wallet_address match
    const { error } = await supabase
      .from("wallet_users")
      .delete()
      .match({ privy_did, address: address_to_remove });

    if (error) {
      console.error("Error deleting wallet address:", error);
      throw error;
    }

    return NextResponse.json(
      { message: "Wallet address removed successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.status || 400 }
    );
  }
}
