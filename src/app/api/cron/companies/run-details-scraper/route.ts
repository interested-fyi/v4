import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        
        // Query to find jobs that haven't been scraped in the last 7 days or have never been scraped
        const { data: jobs, error: jobError } = await supabase
            .from('job_details_last_scraping')
            .select('*')
            .eq('active', true)
            .or(`last_scraped.is.null,last_scraped.lt.${sevenDaysAgo}`);
        
        if (jobError) throw new Error(`Error fetching jobs: ${jobError.message}`);
        
        const postingsSaved: { [key: string]: any } = {};

        for (const job of jobs) {
            try {
                // Initiate scrape job details request without awaiting
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/scrape-job-details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.CRON_SECRET}`
                    },
                    body: JSON.stringify({ posting: job })
                });

                postingsSaved[`${job.id}`] = { status: 'Scraping initiated' };
                
            } catch (e: any) {
                console.error(`Error processing job ${job.id}: ${e.message}`);
                postingsSaved[`${job.id}`] = { status: 'Failed', error: e.message };
            }
        }

        return NextResponse.json({ success: true, postings_saved: postingsSaved }, { status: 200 });
        
    } catch (e) {
        console.error(`Error in job scraping endpoint: ${e}`);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
