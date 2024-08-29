import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  const { fid, castHash, jobId } = await req.json();

  try {
    // save link click to supabase
    console.log(`Link clicked: user ${fid}, job ${castHash} - ${jobId}`);

    //   log click in referral_link_clicks table for user, source and castHash
    const { error } = await supabase.from("referral_link_generated").insert({
      job_id: jobId,
      farcaster_fid: fid,
      source: "farcaster",
    });

    if (error) {
      throw new Error("Error logging link click");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging referral:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
