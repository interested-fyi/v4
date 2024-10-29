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

        for (const talent of data) {
            const typedTalent = talent as UserCombinedProfile;
            //generate profile image
            const svgBuffer = Buffer.from(await generateProfileImage({ user: typedTalent }), 'utf-8');
            const imageBuffer = await sharp(svgBuffer).png().toBuffer();

            //send to telegram
            const inputImage = new InputFile(imageBuffer);

            const secondLine = typedTalent.position && typedTalent.employment_type
                ? `${typedTalent.name} is a <b>${typedTalent.position?.join(', ')}</b> and is seeking <b>${typedTalent.employment_type}</b>.\n\n`
                : typedTalent.position
                ? `${typedTalent.name} is a <b>${typedTalent.position?.join(', ')}</b>.\n\n`
                : typedTalent.employment_type
                ? `${typedTalent.name} is seeking <b>${typedTalent.employment_type}</b>.\n\n`
                : '\n';

            const summary = `<b>👋 Meet ${typedTalent.name}!</b>\n${secondLine}${typedTalent.bio}\n\n<a href="${process.env.NEXT_PUBLIC_BASE_URL}/profile/${typedTalent.privy_did?.replace('did:privy:', '')}">View Profile</a>`;
            console.log(`sending telegram profile: ${typedTalent.name} (${typedTalent.privy_did})`);
            const { message_id } = await bot.api.sendPhoto(
                process.env.TELEGRAM_CHANNEL_ID ?? "",
                inputImage, 
                {
                    caption: summary,
                    parse_mode: "HTML"
                }
            )

            //send  to farcaster
            const signerUUID = process.env.SIGNER_UUID ?? "";
            const url = "https://api.neynar.com/v2/farcaster/cast";
            const params = new URLSearchParams({
                privy_did: typedTalent.privy_did?.replace('did:privy:', '') ?? ''
            });

            const options = {
                method: "POST",
                headers: {
                    accept: "application/json",
                    api_key: process.env.NEYNAR_API_KEY ?? "",
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    signer_uuid: signerUUID,
                    text: `👋 Meet ${typedTalent.name}!\n${secondLine.replace(/<b>/g, '').replace(/<\/b>/g, '')}${typedTalent.bio}\n\nView ${typedTalent.name}'s Profile:\n${process.env.NEXT_PUBLIC_BASE_URL}/profile/${typedTalent.privy_did?.replace('did:privy:', '')}`,
                    embeds: [
                        {
                            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/farcaster/profile-image?${params.toString()}`
                        },
                    ],
                    channel_id: "jobs",
                }),
            };
            console.log(`sending farcaster profile: ${typedTalent.name} (${typedTalent.privy_did})`);
            const response = await fetch(url, options);
            const data = await response.json();

            console.log(data);

            //send to X

            // save to database
            const { data: savedData, error: saveError } = await supabase.from('talent_profile_shared').insert({
                privy_did: typedTalent.privy_did,
                telegram_sent: !!message_id,
                farcaster_sent: !!data.message_id
            }).select('*').single();
        }

        return NextResponse.json('Success', { status: 200 });
    } catch (error) {
        console.error('Error sending talent profiles:', error);
        return NextResponse.json('Internal server error', { status: 500 });
    }
}