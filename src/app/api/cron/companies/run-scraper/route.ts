import { NextRequest, NextResponse } from "next/server";
import greenhouseScraper from "@/functions/job-scraping/greenhouse/greenhouse-scraper";
import supabase from "@/lib/supabase";


export async function POST(req: NextRequest, res: NextResponse) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.INTERNAL_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    // get companies from supabase, and last scraping time
    const { data: companiesData, error: companiesError } = await supabase.from('companies_last_scraping').select('*').eq('approved', true);
    console.log(`Company Data: ${JSON.stringify(companiesData)}`)
    let postingsSaved: { [key: string]: any } = {};

    try {
        if (companiesData) {
            for (const company of companiesData) {
                // scrape company url
                const scrapeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/scrape-jobs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.INTERNAL_SECRET}`
                    },
                    body: JSON.stringify({ url: company.careers_page_url, company_id: company.id })
                });

                if(!scrapeResponse.ok) {
                    throw new Error("Error scraping jobs")
                }

                const scrapeData = await scrapeResponse.json();
                const jobPostings = scrapeData.job_postings;
                console.log(`Job Postings: ${jobPostings}`);
                // save new job postings
                const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/companies/save-job-postings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.INTERNAL_SECRET}`
                    },
                    body: JSON.stringify({ job_postings: jobPostings, company_id: company.id })
                });

                const saveData = await saveResponse.json();

                if(!saveResponse.ok) {
                    throw new Error(saveData.message || "Error saving new job postings")
                };

                postingsSaved[`${company.id}`] = saveData.new_postings;
            }
        }

        return NextResponse.json({ success: true, postings_saved: postingsSaved }, { status: 200 })
    } catch (e) {
        return NextResponse.error();
    }
}