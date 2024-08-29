import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";
import User from "../../../types/user";
import Company from "../../../types/company";
import saveUser from "@/functions/database/save-user";
import sendDirectCast from "@/functions/farcaster/send-direct-cast";

const privyClient = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!);

export async function POST(req: NextRequest) {
    const { company: bodyCompany } = await req.json();
    const company = bodyCompany as Company;

    const { data: companyCreation, error: companyError } = await supabase.from('companies').insert([company]).select();

    if (companyError) throw companyError;

    return NextResponse.json({ company: companyCreation, }, { status: 200 })
}