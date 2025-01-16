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

    // Use Supabase RPC to remove the specific address from the array
    const { data, error } = await supabase.rpc("remove_address_from_array", {
      p_privy_did: privy_did,
      p_address_to_remove: address_to_remove,
    });
    console.log("🚀 ~ DELETE ~ data:", data);

    if (error) {
      console.error("Error in remove_address_from_array:", error);
      throw error;
    }

    // Check if we got any data back
    if (!data) {
      return NextResponse.json(
        { error: "No user found with the specified privy_did" },
        { status: 404 }
      );
    }

    // The function returns an array with a single result
    const updated_user = data[0];

    return NextResponse.json({ updated_user }, { status: 200 });
  } catch (error: any) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.status || 400 }
    );
  }
}
