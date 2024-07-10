import supabase from "@/lib/supabase";
import User from "@/types/user";

export default async function saveUser(user: User) {
    const { data: userCreation, error: userError } = await supabase.from('users').upsert(user, { onConflict: 'fid' }).select();

    if(userError) throw userError;

    return userCreation;
}