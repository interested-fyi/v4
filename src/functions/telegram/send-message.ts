import bot from "@/lib/telegram-bot";
import { ForceReply, InlineKeyboardMarkup, ParseMode, ReplyKeyboardMarkup, ReplyKeyboardRemove } from "grammy/types";


export default async function sendTelegramMessage(channel: string | number, content: string, parseMode: ParseMode | undefined = 'HTML', replyMarkup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply | undefined) {
    try {
        // console.log(`Bot: ${bot.botInfo}`);
        const message = await bot.api.sendMessage(channel, content, {
            parse_mode: parseMode,
            reply_markup: replyMarkup,
        });
        return  { message_id: message.message_id, text: message.text };
    } catch (e) {
        console.error("Error Sending Telegram Message: ", JSON.stringify(e));
    }
}