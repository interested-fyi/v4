import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);
export async function POST(request: Request) {
  try {
    const { privyDid, taskId } = await request.json();

    if (!privyDid || !taskId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const accessToken = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");
    // Verify and authenticate the user
    const verified = await privyClient.verifyAuthToken(accessToken!);
    const privy_did = verified.userId;
    if (privy_did !== privyDid) {
      throw new Error("Privy DIDs do not match");
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
