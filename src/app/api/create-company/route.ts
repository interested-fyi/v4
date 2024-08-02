import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import supabase from "@/lib/supabase";
import User from "../../../types/user";
import Company from "../../../types/company";
import saveUser from "@/functions/database/save-user";
import sendDirectCast from "@/functions/farcaster/send-direct-cast";

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

    const { username, ...userObj } = user;
    const userCreation = await saveUser(userObj);

    const { data: companyCreation, error: companyError } = await supabase.from('companies').insert([company]).select();

    if (companyError) throw companyError;

    const message = `gm @${username},

thank you for signing up with ${company.company_name} 🎉 we're excited to have your company join our platform.
        
your application is currently under review and we’ll get back to you within 48 hours with next steps. as soon as you’re approved, we’ll scrape the company url you provided to post to interested.fyi and the /jobs channel via easy to use frames. 
        
in the meantime, keep an eye on your dms for important announcements about our relaunch - and eventually candidate + scheduling updates. 
        
we're committed to keeping you informed and helping you make the most of your search for interesting connections. if you have any questions or need assistance, feel free me @alec.eth. 
        
cheers`

    // await sendDirectCast(user.fid, message);

    return NextResponse.json({ company: companyCreation, user: userCreation }, { status: 200 })
}