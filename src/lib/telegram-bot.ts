import { Bot } from "grammy";
const dotenv = require('dotenv').config();

const botToken = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? process.env.TELEGRAM_DEV_BOT_KEY ?? '': process.env.TELEGRAM_BOT_KEY ?? '';
console.log(`bot token: ${botToken}`)
const bot = new Bot(botToken);

bot.command('start', async (ctx) => {
    console.log(`Match: ${ctx.match}`);
    const regex = /job:([^:]+)::tgUrl:(.+)/;

    const match = ctx.match.match(regex);

    console.log(`DM Chat ID: ${JSON.stringify(ctx.chat)}`)
    console.log(`Match Regex: ${match}`)
    if (match && match.groups) {
        console.log(`Match: ${match}`)
        const jobId = match[0];
        const telegramUrl = match[1];

        console.log("Job ID:", jobId);
        console.log("Telegram URL:", telegramUrl);
        await ctx.reply(`Copy this link to refer a friend to this job:\n\n${telegramUrl}`)
    } else {
        console.log("No match found");
        await ctx.reply(`Welcome to Interested.FYI!`)
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
    console.log(`Job: ${jobId}, referrer: ${referrerUsername} (${referrerId}), url: ${telegramPostUrl}`)
    console.log(`Sender Chat: ${JSON.stringify(ctx.senderChat)} / ${JSON.stringify(ctx.callbackQuery.message?.sender_chat)}`)
    // await ctx.reply(`Share the below link to share this job\n${telegramPostUrl}`, { parse_mode: 'HTML'});
    try {
        await ctx.api.sendMessage(referrerId, `Copy this link to refer a friend to this job:\n\n${telegramPostUrl}`);
        await ctx.answerCallbackQuery({
            url: `https://t.me/interested_fyi_dev_bot`
        });
    } catch (e) { 
        await ctx.answerCallbackQuery({
            text: `Join our bot to receive referral links and earn!`,
            url: `https://t.me/interested_fyi_dev_bot?start=job:${jobId}::tgUrl:${telegramPostUrl}`
        });
    }
    // await ctx.answerCallbackQuery({
    //     text: `Share the below link to share this job\n${telegramPostUrl}`, // generate referral url
    //     show_alert: false,
    // }); // remove loading animation
});

export default bot;