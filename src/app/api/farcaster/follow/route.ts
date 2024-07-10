import { NextRequest, NextResponse } from "next/server";

// Check if a user follows a profile
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const fid = searchParams.get("fid");
  const viewer_fid = searchParams.get("viewer_fid");
  let cursor = "";

  const url = `https://api.neynar.com/v2/farcaster/following?fid=${fid}&viewer_fid=${viewer_fid}&sort_type=desc_chron&limit=100`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY ?? "",
    },
  };

  let response;
  let data;

  do {
    const fetchUrl = cursor ? `${url}&cursor=${cursor}` : url;
    response = await fetch(fetchUrl, options);
    if (!response.ok) {
      // Handle non-200 status codes
      console.error("Request failed with status:", response.status);
      return NextResponse.error();
    }
    data = await response.json();

    const user = data.users.find(
      (result: User) => result.user.fid.toString() === viewer_fid
    );
    if (user) {
      return NextResponse.json({ following: true }, { status: 200 });
    }
    cursor = data.next.cursor;
  } while (cursor !== null);

  return NextResponse.json({ following: false }, { status: 200 });
}
