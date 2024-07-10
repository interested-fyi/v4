import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import User from "@/types/user";
import Company from "@/types/company";
import greenhouseScraper from "@/functions/job-scraping/greenhouse/greenhouse-scraper";


export async function POST(req: NextRequest, res: NextResponse) {
    // if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return NextResponse.json('Unauthorized', { status: 401 });
    // }

    // get companies from supabase, and last scraping time
    // const { data: companiesData, error: companiesError } = await supabase.from('companies_last_scraping').select();
    // console.log(`Company Data: ${JSON.stringify(companiesData)}`)

    // scrape company url
    await greenhouseScraper('https://underdogfantasy.com/careers');

    return NextResponse.json({ success: true }, { status: 200 })
}