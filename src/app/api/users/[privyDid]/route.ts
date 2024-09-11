import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { privyDid: string } }) {
    const { privyDid } = params;
    const { data, error } = await supabase
        .from('user_profile_combined')
        .select('*')
        .eq('privy_did', `did:privy:${privyDid}`)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
}