import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import User from "@/types/user";
import Company from "@/types/company";
import greenhouseScraper from "@/functions/job-scraping/greenhouse/greenhouse-scraper";


export async function POST(req: NextRequest, res: NextResponse) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.INTERNAL_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    const { url, company_id } = await req.json();

    // get companies from supabase, and last scraping time
    // const { data: companiesData, error: companiesError } = await supabase.from('companies_last_scraping').select();
    // console.log(`Company Data: ${JSON.stringify(companiesData)}`)

    try {
        // scrape company url
        const jobPostings = await greenhouseScraper(url, company_id);
        
        // get saved jobs for company
        const { data: activePostings, error: activeError } = await supabase.from('job_postings').select('*').eq('active', true).eq('company_id', company_id);

        if (activeError) throw new Error('Error fetching existings jobs from database');

        // find which postings are new and save them
        const newPostings = jobPostings?.filter((posting) => {
            return !activePostings?.some((p) => 
                p.role_title === posting.role_title &&
                p.location === posting.location &&
                p.posting_url === posting.posting_url
            );
        });

        if (newPostings && newPostings.length > 0) {
            const { data: saveData, error: saveError } = await supabase.from('job_postings').insert(newPostings);

            if (saveError) throw new Error("Error saving new job postings to database")
        }

        // find which postings in the db are no longer active
        const inactivePostings = activePostings?.filter((posting) => {
            return !jobPostings?.some((p) =>
                p.role_title === posting.role_title &&
                p.location === posting.location &&
                p.posting_url === posting.posting_url
            );
        });

        if (inactivePostings && inactivePostings.length > 0) {
            const inactiveIds = inactivePostings.map((p) => p.id);
            const { data: updateData, error: updateError } = await supabase.from('job_postings').update({ active: false }).in('id', inactiveIds);

            if (updateError) throw new Error("Error updating inactive job postings");
        }

        return NextResponse.json({ success: true, new_postings: newPostings }, { status: 200 })
    } catch (e) {
        return NextResponse.error();
    }
}