import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Extract job ID from the request URL
    const url = new URL(req.url);
    const jobId = url.pathname.split("/").pop(); // Assumes job ID is the last part of the URL

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    // Fetch the job posting by its ID
    const { data: job, error: jobError } = await supabase
      .from("job_postings")
      .select(
        `
        id,
        company_id,
        role_title,
        location,
        posting_url,
        department,
        created_at,
        active,
        companies (company_name),
        job_postings_details (summary, compensation)
      `
      )
      .eq("id", jobId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(); // Fetches a single record

    if (jobError) {
      throw new Error(`Error fetching job: ${jobError.message}`);
    }

    // Return the job data
    return NextResponse.json(
      {
        success: true,
        job: {
          ...job,
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(`Error Fetching Job: ${e.message}`, {
      status: 500,
    });
  }
}
