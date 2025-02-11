import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { privyDid, degenScore, degenScoreWallet } = await req.json();

    if (!privyDid || !degenScore || !degenScoreWallet) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("degen_scores")
      .upsert({
        privy_did: privyDid,
        degen_score: degenScore,
        degen_score_wallet: degenScoreWallet,
      })
      .eq("privy_did", privyDid);

    if (error) {
      console.error(`Error updating DegenScore: ${error.message}`);
      return NextResponse.json(
        { error: "Failed to update DegenScore" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "DegenScore updated successfully" });
  } catch (error) {
    console.error("Error in save-degenscore:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
