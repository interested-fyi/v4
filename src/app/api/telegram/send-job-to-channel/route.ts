import jobUrlBuilder from "@/functions/general/job-url-builder";
import sendTelegramMessage from "@/functions/telegram/send-message";
import { InlineKeyboard } from "grammy";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    try {
        const { job } = await req.json();
        console.log(`sending telegram message: ${job.job_posting_id} (${job.posting_url})`);
        const { message_id } = await sendTelegramMessage(
            process.env.TELEGRAM_CHANNEL_ID ?? '', 
            job.summary, 
            'HTML',
            new InlineKeyboard().text('Refer a Friend', `job=${job.job_posting_id}`).url('Apply Now', jobUrlBuilder(job.posting_url))
        );
        return NextResponse.json({ success: true, url: `https://t.me/${process.env.TELEGRAM_CHANNEL_NAME}/${message_id}`, message_id: message_id }, { status: 200 });
    } catch (e) {
        console.error(`Error sending telegram message: ${e}`);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
