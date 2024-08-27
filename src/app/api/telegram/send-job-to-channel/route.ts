import jobUrlBuilder from "@/functions/general/job-url-builder";
import sendTelegramMessage from "@/functions/telegram/send-message";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { InlineKeyboard } from "grammy";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  const frameURL = "https://api.neynar.com/v2/farcaster/cast";
  if (!process.env.NEYNAR_API_KEY) {
    throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
  }

  const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

  try {
    const { job } = await req.json();
    console.log(
      `sending telegram message: ${job.job_posting_id} (${job.posting_url})`
    );
    const { message_id } = await sendTelegramMessage(
      process.env.TELEGRAM_CHANNEL_ID ?? "",
      job.summary,
      "HTML",
      new InlineKeyboard()
        .text("Refer a Friend", `job=${job.job_posting_id}`)
        .url("Apply Now", jobUrlBuilder(job.posting_url))
    );

    // send cast containing frame to farcaster

    const signerUUID = "1234";

    const response = await neynarClient.publishCast(signerUUID, job.summary, {
      embeds: [
        {
          url: `${process.env.NEXT_PUBLIC_HOST}/api/farcaster/frames/jobs/${job.job_posting_id}?chatName=${process.env.TELEGRAM_CHANNEL_NAME}&msgId=${message_id}}`,
        },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        url: `https://t.me/${process.env.TELEGRAM_CHANNEL_NAME}/${message_id}`,
        message_id: message_id,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(`Error sending telegram message: ${e}`);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
