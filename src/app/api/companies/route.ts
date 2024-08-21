import { NextResponse } from "next/server";
import { MOCK_COMPANY_DATA } from "@/lib/mockData";

export async function GET() {
  // return a mock list of all companies.

  return NextResponse.json(MOCK_COMPANY_DATA, { status: 200 });
}
