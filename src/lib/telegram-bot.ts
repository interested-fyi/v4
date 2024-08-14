import { Bot } from "grammy";
const dotenv = require('dotenv').config();

const botToken = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? process.env.TELEGRAM_DEV_BOT_KEY ?? '': process.env.TELEGRAM_BOT_KEY ?? '';
console.log(`bot token: ${botToken}`)
const bot = new Bot(botToken);

bot.on("callback_query:data", async (ctx) => {
    console.log("Unknown button event with payload ", ctx.callbackQuery.data);
    await ctx.answerCallbackQuery(); // remove loading animation
});

export default bot;