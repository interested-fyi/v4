import { Bot, InlineKeyboard } from "grammy";
import supabase from "./supabase";
import jobUrlBuilder from "@/functions/general/job-url-builder";
const dotenv = require('dotenv').config();

const botToken = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? process.env.TELEGRAM_DEV_BOT_KEY ?? '': process.env.TELEGRAM_BOT_KEY ?? '';
console.log(`bot token: ${botToken}`)
const bot = new Bot(botToken);

bot.command('start', async (ctx) => {
    try {
        const startParam = ctx.match; // This is the base64 encoded string
        console.log(`Start Param: ${startParam}`)
        const decodedParams = JSON.parse(Buffer.from(startParam, 'base64').toString('utf8'));

        const { jobId, chatName, msgId } = decodedParams;

        console.log("Job ID:", jobId);
        console.log("Chat Name:", chatName);
        console.log("Message ID:", msgId);

        const telegramUrl = `https://t.me/${chatName}/${msgId}`;
        await ctx.reply(`Copy this link to refer a friend to this job:\n\n${telegramUrl}`);
    } catch (error) {
        console.error("Error decoding start param:", error);
        await ctx.reply(`Welcome to Interested.FYI!`);
    }
})

bot.on("callback_query:data", async (ctx) => {
    console.log(`Processing referral for ${ctx.callbackQuery.data} from ${JSON.stringify(ctx.callbackQuery.from)}\nMore Context: ${JSON.stringify(ctx.chat)}`);
    const data = ctx.callbackQuery.data;

    if (data.includes('back')) {
        const jobId = data.replace('back=', '');
        const { data: jobData, error: jobDataError } = await supabase.from('job_postings').select('*').eq('id', jobId).limit(1);

        if (jobDataError) {
            console.error(`Error getting job data for ${jobId}: ${jobDataError}`);
            return;
        }

        const job = jobData[0];
        await ctx.editMessageReplyMarkup({
            reply_markup: new InlineKeyboard().text('Copy Link', `job=${jobId}`).url('Apply Now', jobUrlBuilder(job.posting_url))
        })
        return;
    }
    const jobId = ctx.callbackQuery.data.replace('job=', '');
    const referrerId = ctx.callbackQuery.from.id;
    const referrerUsername = ctx.callbackQuery.from.username;
    const chatName = ctx.callbackQuery.message?.chat.username;
    const msgId = ctx.callbackQuery.message?.message_id;
    const telegramPostUrl = `https://t.me/${chatName}/${msgId}`
    const referralUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/referral/telegram?userId=${referrerId}&jobId=${jobId}&chatName=${chatName}&msgId=${msgId}`
    const copyLinkUrl = `https://interested.fyi`
    console.log(`Job: ${jobId}, referrer: ${referrerUsername} (${referrerId}), url: ${telegramPostUrl}`)

    // pull out to endpoint for when copy link button is clicked? check how farcaster implementation handles this
    const { error: updateUserError } = await supabase.from('telegram_users').upsert({
        telegram_user_id: referrerId,
        username: referrerUsername,
        first_name: ctx.callbackQuery.from.first_name,
        last_name: ctx.callbackQuery.from.last_name
    }, { onConflict: 'telegram_user_id' });

    if (updateUserError) {
        console.error(`Error updating or adding telegram user: ${JSON.stringify(updateUserError)}`);
    }

    const { error: logLinkGenError } = await supabase.from('referral_link_generated').insert({
        telegram_user_id: referrerId,
        job_id: jobId,
        url: referralUrl,
        source: 'telegram'
    })

    if (logLinkGenError) {
        console.error(`Error logging referral link generation: ${logLinkGenError}`);
    }

    await ctx.editMessageReplyMarkup({
        reply_markup: new InlineKeyboard().url('Copy Link', `${copyLinkUrl}`).text('Back', `back=${jobId}`)
    })

    // const params = {
    //     jobId: jobId,
    //     chatName: chatName,
    //     msgId: msgId,
    // }
    // const startParam = Buffer.from(JSON.stringify(params)).toString('base64');
    // const chatUrl = `https://t.me/interested_fyi_bot?start=${startParam}`;
    // console.log(`Chat URL: ${chatUrl}`);
    // try {
    //     await ctx.api.sendMessage(referrerId, `Copy this link to refer a friend to this job:\n\n${referralUrl}`);
    //     await ctx.answerCallbackQuery({
    //         url: chatUrl
    //     });
    // } catch (e) { 
    //     await ctx.answerCallbackQuery({
    //         text: `Join our bot to receive referral links and earn!`,
    //         url: chatUrl
    //     });
    // }
});

export default bot;