import { Bot } from "grammy";
const dotenv = require('dotenv').config();

const botToken = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? process.env.TELEGRAM_DEV_BOT_KEY ?? '': process.env.TELEGRAM_BOT_KEY ?? '';
console.log(`bot token: ${botToken}`)
const bot = new Bot(botToken);

bot.command('start', async (ctx) => {
    console.log(ctx.match);
    await ctx.reply(ctx.match)
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
    // await ctx.reply(`Share the below link to share this job\n${telegramPostUrl}`, { parse_mode: 'HTML'});
    await ctx.answerCallbackQuery({
        text: `Join our bot to receive referral links and earn!`,
        url: `https://t.me/interested_fyi_dev_bot?start=job-${jobId}&tgUrl=${telegramPostUrl}`
    })
    // await ctx.answerCallbackQuery({
    //     text: `Share the below link to share this job\n${telegramPostUrl}`, // generate referral url
    //     show_alert: false,
    // }); // remove loading animation
});

export default bot;