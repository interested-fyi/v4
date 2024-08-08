import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import User from "@/types/user";
import Company from "@/types/company";
import JobPosting from "@/types/job-posting";
import extractJobBody from "@/functions/job-scraping/description_scraper/extract-job-body";
import extractJobData from "@/functions/job-scraping/description_scraper/ai-description-scraper";

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    const { job_postings, company_id } = await req.json();

    // get companies from supabase, and last scraping time
    // const { data: companiesData, error: companiesError } = await supabase.from('companies_last_scraping').select();
    // console.log(`Company Data: ${JSON.stringify(companiesData)}`)

    try { 
        // get saved jobs for company
        console.log(`getting active jobs`)
        const { data: activePostings, error: activeError } = await supabase.from('job_postings').select('*').eq('active', true).eq('company_id', company_id);

        console.log(`active Jobs: ${activePostings}`);
        if (activeError) throw new Error('Error fetching existings jobs from database');

        // find which postings are new and save them
        const newPostings = job_postings?.filter((posting: JobPosting) => {
            return !activePostings?.some((p) => 
                p.role_title === posting.role_title &&
                p.location === posting.location &&
                p.posting_url === posting.posting_url
            );
        });

        console.log(`new postings: ${newPostings}`);

        if (newPostings && newPostings.length > 0) {
            const { data: saveData, error: saveError } = await supabase.from('job_postings').insert(newPostings).select();

            if (saveError) throw new Error("Error saving new job postings to database");

            for (const posting of saveData) {
                console.log(`scraping details for: ${posting}`)
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/scrape-job-details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.CRON_SECRET}`
                    },
                    body: JSON.stringify({ posting: posting })
                });
            }
        }

        // find which postings in the db are no longer active
        const inactivePostings = activePostings?.filter((posting) => {
            return !job_postings?.some((p: JobPosting) =>
                p.role_title === posting.role_title &&
                p.location === posting.location &&
                p.posting_url === posting.posting_url
            );
        });

        if (inactivePostings && inactivePostings.length > 0) {
            const inactiveIds = inactivePostings.map((p) => p.id);
            const { data: updateData, error: updateError } = await supabase.from('job_postings').update({ active: false }).in('id', inactiveIds);

            if (updateError) {
                throw new Error("Error updating inactive job postings");
            }
        }

        return NextResponse.json({ success: true, new_postings: newPostings }, { status: 200 })
    } catch (e) {
        console.log(`Error saving job: ${e}`);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}