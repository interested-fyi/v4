import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { toCamelCase } from "@/lib/utils";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("degen_scores")
      .select("privy_did, degen_score")
      .order("degen_score", { ascending: false })
      .limit(10); // Adjust the limit if needed

    if (error) {
      throw error;
    }

    // select photo_source, name from user_profiles where privy_did in (select privy_did from degen_scores order by degen_score desc limit 10) and join with degen_scores
    const { data: userData, error: userDataError } = await supabase
      .from("user_profiles")
      .select("privy_did, name, photo_source, total_points")
      .in(
        "privy_did",
        data.map((d) => d.privy_did)
      );

    if (userDataError) {
      throw userDataError;
    }

    // join degen_scores with user_profiles
    userData.forEach((user) => {
      const degenScore = data.find((d) => d.privy_did === user.privy_did);
      user.total_points = degenScore?.degen_score;
    });

    const transformedData = userData.map(toCamelCase);
    return NextResponse.json({ users: transformedData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching top users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
