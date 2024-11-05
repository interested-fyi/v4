import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const url = `https://api.poap.tech/actions/scan/${address}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": process.env.POAP_API_KEY ?? "",
      },
    };

    const response = await fetch(url, options);

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
