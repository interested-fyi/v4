import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(req: Request) {
  const { userId, jobId, url } = await req.json();

  try {
    // save link click to supabase
    console.log(`Link clicked: user ${userId}, job ${jobId} - ${url}`)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging referral:', error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}