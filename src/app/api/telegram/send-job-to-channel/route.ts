import jobUrlBuilder from "@/functions/general/job-url-builder";
import sendTelegramMessage from "@/functions/telegram/send-message";
import { sendTweet } from "@/lib/twitter";
import { InlineKeyboard } from "grammy";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  if (!process.env.NEYNAR_API_KEY) {
    throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
  }

  if (!process.env.SIGNER_UUID) {
    throw new Error("Make sure you set SIGNER_UUID in your .env file");
  }

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

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
        
    console.log('getting tweet text');
    const tweetResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'text'},
        messages: [
            {role: 'system', content: "You are a job summary tweet bot. You are given job descriptions or summaries and need to shorten them down to a tweet of 280 characters or less."},
            {role: "user", content: `Job Description: ${job.summary}`}
        ]
    });
    const generatedText = tweetResponse.choices[0].message.content;
    console.log('generated tweet text', generatedText);
    const tweet = await sendTweet(`${generatedText}\n\n${jobUrlBuilder(job.posting_url)}`);

    // send cast containing frame to farcaster
    const signerUUID = process.env.SIGNER_UUID ?? "";
    const url = "https://api.neynar.com/v2/farcaster/cast";

    const frameURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/farcaster/frames/jobs/${job.job_posting_id}?chatName=${process.env.TELEGRAM_CHANNEL_NAME}&msgId=${message_id}`;

    console.log("🚀 ~ POST ~ frameURL:", frameURL);
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        signer_uuid: signerUUID,
        embeds: [
          {
            url: frameURL,
          },
        ],
        channel_id: "jobs",
      }),
    };
    const response = await fetch(url, options);
    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        url: `https://t.me/${process.env.TELEGRAM_CHANNEL_NAME}/${message_id}`,
        message_id: message_id,
        cast_hash: data.cast.hash,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(`Error sending telegram message: ${e}`);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
