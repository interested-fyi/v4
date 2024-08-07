import supabase from "@/lib/supabase";
import User from "@/types/user";

export default async function saveUser(user: User) {
    // 
    const { telegram_user, ...userObj } = user;

    const { data: userCreation, error: userError } = await supabase.from('users').upsert(userObj, { onConflict: 'privy_did' }).select();

    if(userError) throw userError;

    const { data: tgUserCreation, error: tgUserError } = await supabase.from('telegram_users').upsert(telegram_user, { onConflict: 'telegram_user_id' }).select();
 
    if(tgUserError) throw tgUserError;

    return { user: userCreation, telegram_user: tgUserCreation };
}