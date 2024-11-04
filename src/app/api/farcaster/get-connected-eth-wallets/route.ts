// app/api/fetch-eth-addresses/route.js
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const fids = req.nextUrl.searchParams.getAll("fid");

    if (!Array.isArray(fids) || fids.length === 0) {
      return NextResponse.json(
        { error: "Invalid FIDs array" },
        { status: 400 }
      );
    }

    const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.join(
      "%2C"
    )}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": process.env.NEYNAR_API_KEY ?? "",
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from Neynar" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Extracting Ethereum addresses from the response
    const result = data.users.map(
      (user: {
        fid: string;
        verified_addresses: {
          eth_addresses: string[];
        };
      }) => ({
        fid: user.fid,
        ethAddresses: user.verified_addresses?.eth_addresses || [],
      })
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
