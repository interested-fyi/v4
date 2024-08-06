import TelegramUser from "./telegram_user";

export default interface User {
  id?: number;
  created_at?: Date;
  privy_did: string;
  telegram_user?: TelegramUser;
  email?: string;
  username?: string;
  is_admin: boolean;
}
