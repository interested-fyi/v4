import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import sendTelegramMessage from "@/functions/telegram/send-message";
import { UserCombinedProfile } from "@/types/return_types";
import { generateProfileImage } from "@/lib/satori";
import { InputFile } from "grammy";
import sharp from "sharp";
import bot from "@/lib/telegram-bot";

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
            const svgBuffer = Buffer.from(await generateProfileImage({ user: typedTalent }), 'utf-8');
            const imageBuffer = await sharp(svgBuffer).png().toBuffer();

            console.log(imageBuffer);
            //send to telegram
            const inputImage = new InputFile(imageBuffer);
            const summary = `<b>👋 Meet ${typedTalent.name}!</b>
                ${typedTalent.name} is a ${typedTalent.position} and is looking for ${typedTalent.employment_type}.`;
            console.log(`sending telegram message: ${typedTalent.name} (${typedTalent.privy_did})`);
            const { message_id } = await bot.api.sendPhoto(
                process.env.TELEGRAM_CHANNEL_ID ?? "",
                inputImage, 
                {
                    caption: summary,
                    parse_mode: "HTML"
                }
            )

            //send  to farcaster

            //send to X
        }

    } catch (error) {
        console.error('Error sending talent profiles:', error);
        return NextResponse.json('Internal server error', { status: 500 });
    }
}