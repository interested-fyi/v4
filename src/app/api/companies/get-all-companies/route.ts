import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";
import User from "@/types/user";
import Company from "@/types/company";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function GET(req: NextRequest, res: NextResponse) {
  const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  console.log(`Auth Token: ${authToken}`)
  try {
    const verificationClaim = await privyClient.verifyAuthToken(authToken!);

    // get user and check if is admin
    console.log(`Verification Claim: ${verificationClaim.userId}`);
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select()
      .eq("privy_did", verificationClaim.userId)
      .returns<User[]>();

    if (userError) {
      throw new Error(
        `Error fetching user for the supplied auth token: ${userError}`
      );
    }

    const user = userData?.[0];
    console.log(`User: ${JSON.stringify(userData)}`)
    if (!user.is_admin) {
      throw new Error("User is not an admin");
    }

    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select()
      .returns<Company[]>();

    if (companyError) {
      throw new Error(`Error fetching company data: ${companyError}`);
    }

    return NextResponse.json(
      { success: true, companies: companyData },
      { status: 200 }
    );
  } catch (e) {
    console.log(`Error Fetching Companies: ${e}`)
    return NextResponse.json(`Error Fetching Companies: ${e}`, { status: 401 });
  }
}
