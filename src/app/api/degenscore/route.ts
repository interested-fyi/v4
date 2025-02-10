import { DegenScoreResponse } from "@/app/profile/[privyDid]/page";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest, NextResponse } from "next/server";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function GET(req: NextRequest) {
  const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  console.log("🚀 ~ GET ~ authToken:", authToken);

  try {
    const verificationClaim = await privyClient.verifyAuthToken(authToken!);
    console.log("🚀 ~ GET ~ verificationClaim:", verificationClaim);
    const privyDid = verificationClaim.userId;

    // Fetch user's wallet addresses
    const { data: userData, error: userError } = await supabase
      .from("user_profile_combined")
      .select("wallet_addresses")
      .eq("privy_did", privyDid)
      .single();

    if (!userData || userError) {
      throw new Error(
        `Error fetching user for the supplied auth token: ${userError?.message}`
      );
    }
    console.log("🚀 ~ GET ~ userData:", userData);

    if (!userData.wallet_addresses || userData.wallet_addresses.length === 0) {
      return NextResponse.json(
        { message: "No wallet addresses found." },
        { status: 404 }
      );
    }

    // Iterate through wallet addresses one by one
    for (const address of userData.wallet_addresses) {
      console.log("🚀 ~ GET ~ address:", address);
      try {
        const response = await fetch(
          `https://beacon.degenscore.com/v2/beacon/${address}`
        );

        if (!response.ok) {
          console.warn(`Failed to fetch Beacon for address: ${address}`);
          continue;
        }

        const degenScoreData: DegenScoreResponse = await response.json();

        if (degenScoreData?.properties?.DegenScore) {
          // Call the new API route to save the score
          await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/save-degenscore`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                privyDid,
                degenScore: degenScoreData.properties.DegenScore,
                degenScoreWallet: address,
              }),
            }
          );

          return NextResponse.json(
            {
              degen_score: degenScoreData.properties.DegenScore,
              degen_score_wallet: address,
            },
            { status: 200 }
          );
        }
      } catch (error) {
        console.error(`Error checking address ${address}:`, error);
      }
    }

    return NextResponse.json(
      { message: "No valid DegenScore found." },
      { status: 404 }
    );
  } catch (e) {
    console.error(`Unauthorized: ${e}`);
    return NextResponse.json({ error: `Unauthorized: ${e}` }, { status: 401 });
  }
}
