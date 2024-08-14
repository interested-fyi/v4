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
        await sendTelegramMessage(
            process.env.TELEGRAM_CHANNEL_NAME ?? '', 
            job.summary, 
            'HTML',
            new InlineKeyboard().text('Refer a Friend', `job=${job.job_posting_id}`).url('Apply Now', jobUrlBuilder(job.posting_url))
        );
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        console.error(`Error sending telegram message: ${e}`);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
