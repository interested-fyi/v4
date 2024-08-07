import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { AuthTokenClaims, PrivyClient } from "@privy-io/server-auth";
import User from "@/types/user";
import greenhouseScraper from "@/functions/job-scraping/greenhouse/greenhouse-scraper";

const privyClient = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!);

export async function POST(req: NextRequest, res: NextResponse) {
    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '');
    try {
        if(!authToken) {
            return NextResponse.json(`Unauthorized`, { status: 401 });
        }

        let verificationClaim: AuthTokenClaims;
        try {
            verificationClaim = await privyClient.verifyAuthToken(authToken!);
        } catch (e) {
            return NextResponse.json(`Unauthorized: ${e}`, { status: 401 })
        }

        // get user and check if is admin
        const { data: userData, error: userError } = await supabase.from('users').select().eq('privy_did', verificationClaim.userId).returns<User[]>();

        if (userError) {
            throw new Error(`Error fetching user for the supplied auth token: ${userError}`);
        }

        const user = userData?.[0];
        if (!user || !user.is_admin) {
            return NextResponse.json('User is not an admin', { status: 403 });
        }

        return handleRequest(req, res);
    } catch (e) {
        return NextResponse.json(`Error: ${e}`, { status: 500 });
    }
}

async function handleRequest(req: NextRequest, res: NextResponse) {
    try {
        let { companyId } = await req.json();

        const { data: company, error: companyError } = await supabase.from('companies').update({ denied: true }).eq('id', companyId).select();

        if (companyError) {
            throw new Error('Error updating company denial');
        }

        return NextResponse.json({ success: true, company: company }, { status: 200 })
    } catch (e) {
        return NextResponse.json(`Error scraping jobs: ${e}`, { status: 500 });
    }
}