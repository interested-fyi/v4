export default interface TelegramUser {
    privy_did: string;
    telegram_user_id: string;
    username: string;
    photo_url?: string;
    first_name?: string;
    last_name?: string;
}