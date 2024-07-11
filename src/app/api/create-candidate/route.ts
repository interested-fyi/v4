import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";
import User from "../../../types/user";
import saveUser from "@/functions/database/save-user";
import Candidate from "@/types/candidate";

const privyClient = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!);

export async function POST(req: NextRequest) {
    const { user: bodyUser, candidate: bodyCandidate } = await req.json();
    const user = bodyUser as User;
    const candidate = bodyCandidate as Candidate;
    const accessToken = req.headers.get('Authorization')?.replace('Bearer ','');
    
    // verify authenticate user sent request
    try {
        const verified = await privyClient.verifyAuthToken(accessToken!);
    } catch (e) {
        throw new Error('Invalid access token');
    }

    const userCreation = await saveUser(user);

    const { data: candidateCreation, error: candidateError } = await supabase.from('candidates').insert([candidate]).select();

    if (candidateError) throw candidateError;

    return NextResponse.json({ candidate: candidateCreation, user: userCreation }, { status: 200 })
}