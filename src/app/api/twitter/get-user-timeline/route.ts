// pages/api/github/activity.js
import { fetchLatestTweets } from "@/lib/twitter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get("username");
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetchLatestTweets(username);

    if (!response.success) {
      return NextResponse.json(
        { error: "Failed to fetch user X timeline" },
        { status: 500 }
      );
    }

    return NextResponse.json(response.tweets, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user X timeline" },
      { status: 500 }
    );
  }
}
