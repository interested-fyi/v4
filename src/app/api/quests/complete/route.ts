import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { privyDid, taskId } = await request.json();

    if (!privyDid || !taskId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call the Supabase PostgreSQL function
    const { data, error } = await supabase.rpc("complete_task", {
      privy_did_var: privyDid,
      task_id_var: taskId,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Task completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error completing task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
