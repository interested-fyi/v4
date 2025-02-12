import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    // Extract the privy_did from the query parameters
    const { searchParams } = new URL(request.url);
    const privyDid = searchParams.get("privy_did");

    if (!privyDid) {
      return NextResponse.json(
        { error: "Missing privy_did parameter" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("attestations")
      .select("*")
      .eq("recipient", privyDid);

    if (error) {
      throw error;
    }
    if (data.length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
