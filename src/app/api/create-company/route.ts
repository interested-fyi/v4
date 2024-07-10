import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";
import User from "../../../types/user";
import Company from "../../../types/company";
import saveUser from "@/functions/database/save-user";

const privyClient = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!);

export async function POST(req: NextRequest) {
    const { user: bodyUser, company: bodyCompany } = await req.json();
    const user = bodyUser as User;
    const company = bodyCompany as Company;
    const accessToken = req.headers.get('Authorization')?.replace('Bearer ','');
    
    // verify authenticate user sent request
    try {
        const verified = await privyClient.verifyAuthToken(accessToken!);
    } catch (e) {
        throw new Error('Invalid access token');
    }

    const userCreation = await saveUser(user);

    const { data: companyCreation, error: companyError } = await supabase.from('companies').insert([company]).select();

    if (companyError) throw companyError;

    return NextResponse.json({ company: companyCreation, user: userCreation }, { status: 200 })
}