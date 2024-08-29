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
        let { url, jobs, companyId } = await req.json();


        if (!jobs) {
            jobs = await greenhouseScraper(url, companyId);
        }
        
        // save jobs
        const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/save-job-postings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CRON_SECRET}`
            },
            body: JSON.stringify({ job_postings: jobs, company_id: companyId })
        });

        const saveData = await saveResponse.json();

        if(!saveResponse.ok) {
            throw new Error(saveData.message || "Error saving new job postings")
        };

        const newPostings = saveData.new_postings;

        const { error: insertError } = await supabase.from('companies_job_scrapings').insert({
            company_id: companyId,
            success: true,
            jobs_scraped: saveData.new_postings?.length
        });

        // 
        const { data: company, error: companyError } = await supabase.from('companies').update({ approved: true }).eq('id', companyId).select();

        if (companyError) {
            throw new Error('Error updating company approval');
        }

        return NextResponse.json({ success: true, job_postings: newPostings, company: company }, { status: 200 })
    } catch (e) {
        console.log(`Error approving company: ${e}`)
        return NextResponse.json(`Error approving company: ${e}`, { status: 500 });
    }
}