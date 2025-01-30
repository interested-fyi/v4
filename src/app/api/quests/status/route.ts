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
    let filteredTasks;

    const todayUTC = new Date().toISOString().split("T")[0];

    const { data: completedTasks, error } = await supabase
      .from("user_tasks")
      .select("task_id")
      .eq("privy_did", privyDid);

    const { data: dailyLoginCompleted, error: dailyLoginError } = await supabase
      .from("user_tasks")
      .select("task_id")
      .eq("privy_did", privyDid)
      .eq("task_id", "daily_login")
      .gte("completed_at", todayUTC)
      .single();
    if (completedTasks) {
      filteredTasks = completedTasks.filter(
        (task) => task.task_id !== "daily_login"
      );
      if (dailyLoginCompleted) {
        filteredTasks.push(dailyLoginCompleted);
      }
    }

    const { data: totalPoints, error: totalPointsError } = await supabase
      .from("user_profiles")
      .select("total_points")
      .eq("privy_did", privyDid)
      .single();
    if (error) {
      throw error;
    }

    // Extract the task IDs from the completed tasks
    const completedTaskIds = filteredTasks?.map((task) => task.task_id);
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
