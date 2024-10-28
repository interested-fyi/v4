import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const fid = searchParams.get("fid");

  const url = `https://hub-api.neynar.com/v1/castsByFid?fid=${fid}&pageSize=20&reverse=true`;
  const options = {
    method: "GET",
    headers: { accept: "application/json", "x-api-key": "NEYNAR_API_DOCS" },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    console.error("Request failed with status:", response.status);
    return NextResponse.error();
  }

  const json = await response.json();
  return NextResponse.json(json, { status: 200 });
}
