import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import sendTelegramMessage from "@/functions/telegram/send-message";
import { UserCombinedProfile } from "@/types/return_types";
import { generateProfileImage } from "@/lib/satori";

export async function GET(req: NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    try {    
        const { data, error } = await supabase.from('talent_to_share').select('*');
        if (error) {
            console.error('Error fetching talent profiles:', error);
            return NextResponse.json('Internal server error', { status: 500 });
        }

        console.log('Fetched talent profiles:', data);

        for (const talent of data) {
            const typedTalent = talent as UserCombinedProfile;
            //generate profile image
            const profileImage = await generateProfileImage({ user: typedTalent });
            console.log(profileImage);
            //send to telegram
            console.log(
                `sending telegram message: ${typedTalent.name} (${typedTalent.privy_did})`
            );
            const summary = `<div>
                <p><strong>👋 Meet ${typedTalent.name}!</strong></p>
                <p>${typedTalent.name} is a ${typedTalent.position} and is looking for ${typedTalent.employment_type}.</p>
                <svg>${profileImage}</svg>
            </div>`;
            const { message_id } = await sendTelegramMessage(
                process.env.TELEGRAM_CHANNEL_ID ?? "",
                summary,
                "HTML",
            );

            //send  to farcaster

            //send to X
        }

    } catch (error) {
        console.error('Error sending talent profiles:', error);
        return NextResponse.json('Internal server error', { status: 500 });
    }
}