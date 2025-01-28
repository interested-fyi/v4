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

    // Fetch completed tasks for the given privy_did
    const { data: completedTasks, error } = await supabase
      .from("user_tasks")
      .select("task_id")
      .eq("privy_did", privyDid);

    const { data: totalPoints, error: totalPointsError } = await supabase
      .from("user_profiles")
      .select("total_points")
      .eq("privy_did", privyDid)
      .single();

    console.log("🚀 ~ GET ~ totalPoints:", totalPoints);

    if (error) {
      throw error;
    }

    // Extract the task IDs from the completed tasks
    const completedTaskIds = completedTasks.map((task) => task.task_id);
    console.log("🚀 ~ GET ~ completedTaskIds:", completedTaskIds);

    return NextResponse.json(
      { completedTaskIds, totalPoints: totalPoints?.total_points || 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
