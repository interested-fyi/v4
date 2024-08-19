import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(req: Request) {
  const { userId, jobId, telegramPostUrl } = await req.json();

  try {
    // save link click to supabase
    console.log(`Link clicked: user ${userId}, job ${jobId} - ${telegramPostUrl}`);

    // log click in referral_link_clicks table for user, source and jobId
    const { error } = await supabase.from('referral_link_click').insert({
        job_id: jobId,
        telegram_user_id: userId,
        url: telegramPostUrl,
        source: 'telegram'
    });

    if (error) {
        throw new Error('Error logging link click');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging referral:', error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}