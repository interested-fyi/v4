import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
    const { fid, company_name, careers_url, email } = await req.json();

    console.log(`Input data: ${fid} / ${company_name} / ${careers_url} / ${email}`);

    const { data: existingUser, error: userError } = await supabase.from('users').select('*').eq('fid', fid).single();

    const { data, error } = await supabase.from('companies').insert([
        {
            creator_fid: fid,
            company_name: company_name,
            careers_page_url: careers_url,
            creator_email: email,
        }
    ])

    if(error) throw error;

    console.log(`data: ${data}`);
    return NextResponse.json({}, { status: 200 })
}