import { Bot } from "grammy";
import supabase from "./supabase";
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
        await ctx.reply(`Welcome to Interested.fyi\n\nFor those starting our bot for the first time, you’ll need to go back to the @interestedfyi channel where you left off to generate your first referral code. After, all referral links generated will be sent here directly.\n\nThanks for giving us a try. If you need any help reach out to @chipagosfinest.\n\nCheers all`);
    }
})

bot.on("callback_query:data", async (ctx) => {
    console.log(`Processing referral for ${ctx.callbackQuery.data} from ${JSON.stringify(ctx.callbackQuery.from)}\nMore Context: ${JSON.stringify(ctx.chat)}`);
    const jobId = ctx.callbackQuery.data.replace('job=', '');
    const referrerId = ctx.callbackQuery.from.id;
    const referrerUsername = ctx.callbackQuery.from.username;
    const chatName = ctx.callbackQuery.message?.chat.username;
    const msgId = ctx.callbackQuery.message?.message_id;
    const telegramPostUrl = `https://t.me/${chatName}/${msgId}`
    const referralUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/referral/telegram?userId=${referrerId}&jobId=${jobId}&chatName=${chatName}&msgId=${msgId}`
    console.log(`Job: ${jobId}, referrer: ${referrerUsername} (${referrerId}), url: ${telegramPostUrl}`)
    console.log(`Sender Chat: ${JSON.stringify(ctx.senderChat)} / ${JSON.stringify(ctx.callbackQuery.message?.sender_chat)}`)
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

    // await ctx.reply(`Share the below link to share this job\n${telegramPostUrl}`, { parse_mode: 'HTML'});
    const params = {
        jobId: jobId,
        chatName: chatName,
        msgId: msgId,
    }
    const startParam = Buffer.from(JSON.stringify(params)).toString('base64');
    const chatUrl = `https://t.me/interested_fyi_bot?start=${startParam}`;
    console.log(`Chat URL: ${chatUrl}`);
    try {
        await ctx.api.sendMessage(referrerId, `Copy this link to refer a friend to this job:\n\n${referralUrl}`);
        await ctx.answerCallbackQuery({
            url: chatUrl
        });
    } catch (e) { 
        await ctx.answerCallbackQuery({
            text: `Join our bot to receive referral links and earn!`,
            url: chatUrl
        });
    }
    // await ctx.answerCallbackQuery({
    //     text: `Share the below link to share this job\n${telegramPostUrl}`, // generate referral url
    //     show_alert: false,
    // }); // remove loading animation
});

export default bot;