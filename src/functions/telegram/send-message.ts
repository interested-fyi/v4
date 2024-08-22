import bot from "@/lib/telegram-bot";
import { ForceReply, InlineKeyboardMarkup, ParseMode, ReplyKeyboardMarkup, ReplyKeyboardRemove } from "grammy/types";

async function sendTelegramMessageToAPI(
    channel: string | number,
    content: string,
    parseMode: ParseMode | undefined,
    replyMarkup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
) {
    return await bot.api.sendMessage(channel, content, {
        parse_mode: parseMode,
        reply_markup: replyMarkup,
    });
}

export default async function sendTelegramMessage(channel: string | number, content: string, parseMode: ParseMode | undefined = 'HTML', replyMarkup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply | undefined) {
    try {
        const message = await sendTelegramMessageToAPI(channel, content, parseMode, replyMarkup);
        return { message_id: message.message_id, text: message.text };
    } catch (e: any) {
        console.error("Error Sending Telegram Message: ", JSON.stringify(e));

        // Check if the error is a 429 Too Many Requests error
        if (e.error_code === 429) {
            console.log("Too Many Requests: Retrying after 10 seconds...");

            // Wait for 10 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 10000));

            // Retry sending the message
            try {
                const message = await sendTelegramMessageToAPI(channel, content, parseMode, replyMarkup);
                return { message_id: message.message_id, text: message.text };
            } catch (retryError) {
                console.error("Error Sending Telegram Message on Retry: ", JSON.stringify(retryError));
                return {};
            }
        } else {
            return {};
        }
    }
}