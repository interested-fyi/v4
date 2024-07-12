import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";
import User from "../../../types/user";
import saveUser from "@/functions/database/save-user";
import Candidate from "@/types/candidate";
import sendDirectCast from "@/functions/farcaster/send-direct-cast";

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

    const { username, ...userObj } = user;
    const userCreation = await saveUser(userObj);

    const { data: candidateCreation, error: candidateError } = await supabase.from('candidates').insert([candidate]).select();

    if (candidateError) throw candidateError;

    if(candidate.accept_direct_messages) {
        const message = `gm @${username},

we’re so thankful to have you 🙂 
            
keep an eye on your DCs and our channel + account for upcoming announcements, job postings, status updates, and more. we're committed to keeping you informed and helping you make the most of your search for interesting connections.
            
if you have any questions or need assistance, feel free to reach out to @alec.eth. here to help!
            
cheers all`
        
            await sendDirectCast(user.fid, message);
    }

    return NextResponse.json({ candidate: candidateCreation, user: userCreation }, { status: 200 })
}