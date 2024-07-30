import { NextRequest, NextResponse } from "next/server";
import greenhouseScraper from "@/functions/job-scraping/greenhouse/greenhouse-scraper";


export async function POST(req: NextRequest, res: NextResponse) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    const { url, company_id } = await req.json();

    // get companies from supabase, and last scraping time
    // const { data: companiesData, error: companiesError } = await supabase.from('companies_last_scraping').select();
    // console.log(`Company Data: ${JSON.stringify(companiesData)}`)

    try {
        // scrape company url
        const jobPostings = await greenhouseScraper(url, company_id);

        return NextResponse.json({ success: true, job_postings: jobPostings }, { status: 200 })
    } catch (e) {
        return NextResponse.error();
    }
}