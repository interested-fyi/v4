import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import User from "@/types/user";
import Company from "@/types/company";
import JobPosting from "@/types/job-posting";
import extractJobBody from "@/functions/job-scraping/description_scraper/extract-job-body";
import extractJobData from "@/functions/job-scraping/description_scraper/ai-description-scraper";

export async function POST(req: NextRequest, res: NextResponse) {
    console.log(`scraping details...`)
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    const { posting } = await req.json();

    try { 
        const jobData = await extractJobData(posting.posting_url);
        if(!jobData) {
            throw new Error(`Failed to scrape and parse job details for: ${posting.posting_url} (${posting.posting_id})`)
        }
        const enrichedData = jobData?.content;

        console.log(`Enriched Data: ${JSON.stringify(enrichedData)}\nTitle: ${enrichedData.title}, description: ${enrichedData.description}`)
        if (enrichedData && enrichedData.description && enrichedData.title) {
            const { data, error: detailsError } = await supabase.rpc('update_job_details_and_scraping', {
                p_job_posting_id: posting.id,
                p_description: enrichedData.description,
                p_summary: enrichedData.summary,
                p_compensation: enrichedData.compensation,
                p_title: enrichedData.title,
                p_location: enrichedData.location
            })

            if (detailsError) throw new Error(`Error saving job details for ${posting.posting_url} (${posting.id}): ${detailsError.message}`)

            return NextResponse.json({ success: true, ids: data?.[0] }, { status: 200 })
        } else {
            throw new Error(`Job Details Not Complete: ${posting.posting_url} (${posting.posting_id})`)
        }
    } catch (e) {
        console.log(`Error: ${e}`)
        return NextResponse.json({ error: e }, { status: 500 });
    }
}