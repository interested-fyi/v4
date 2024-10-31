// pages/api/github/activity.js
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
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public`,
      {
        method: "GET",
        headers: {},
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user activity" },
        { status: 500 }
      );
    }
    return NextResponse.json(await response.json(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user activity" },
      { status: 500 }
    );
  }
}
