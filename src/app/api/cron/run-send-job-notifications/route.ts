import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    try {        
        const { data: eligibleJobs, error: eligibleJobsError } = await supabase
            .from('job_posting_telegram_last_posted')
            .select('*')
            .eq('active', true)
            .or(`last_posted_date.is.null,last_posted_date.lt.${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`);

        if (eligibleJobsError) {
            console.error('Error fetching eligible job postings:', eligibleJobsError);
        }

        const { data: recentPosts, error: recentPostsError } = await supabase
            .from('job_posting_telegram_last_posted')
            .select('company_id, last_posted_date, job_posting_id')
            .not('last_posted_date', 'is', null)
            .gte('last_posted_date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        if (recentPostsError) {
            console.error('Error fetching recent posts by company:', recentPostsError);
        }

        const recentPostsCount = recentPosts?.reduce((acc, post) => {
            acc[post.company_id] = (acc[post.company_id] || 0) + 1;
            return acc
        }, {} as Record<string, number>) || {};  

        const postPromises = [];
        for (const job of eligibleJobs || []) {
            const companyId = job.company_id;

            if(!recentPostsCount[companyId]) {
                recentPostsCount[companyId] = 0;
            }

            if (recentPostsCount[companyId] < 5) {
                console.log(`Posting job for company: ${companyId}, ${job.job_posting_id}`);
                const content = `<b>${job.company_name}</b>\n<b>Position: </b>${job.title}\n<b>Location: </b>${job.location}${job.compensation && job.compensation !== 'null' ? `\n<b>Compensation: </b>${job.compensation}` : ''}\n\n${job.summary}`

                recentPostsCount[companyId]++;  // Increment after a successful post

                const postPromise = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/telegram/send-job-to-channel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.CRON_SECRET}`
                    },
                    body: JSON.stringify({ job: {
                        summary: content,
                        job_posting_id: job.job_posting_id,
                        posting_url: job.posting_url
                    }})
                })
                .then(async (response) => {
                    if (response.ok) {
                        const responseData = await response.json();
                        const { error } = await supabase
                            .from('job_postings_telegram_posts')
                            .insert({
                                job_id: job.job_posting_id,
                                msg_url: responseData.url,  // Replace with actual URL returned by the Telegram API
                                msg_id: responseData.message_id,
                                msg_channel: process.env.TELEGRAM_CHANNEL_NAME,  // Replace with the actual Telegram channel name
                                msg_content: content,
                            });

                        if (error) {
                            console.error('Error updating job_postings_telegram_posts:', error);
                            throw error;
                        } else {
                            console.log(`Job ${job.job_posting_id} successfully posted to Telegram.`);
                            return { job_posting_id: job.job_posting_id, status: 'fulfilled' };
                        }
                    } else {
                        console.error(`Failed to send job ${job.job_posting_id} to Telegram. Status: ${response.status}`);
                        return { job_posting_id: job.job_posting_id, status: 'rejected', reason: `Failed with status ${response.status}` };
                    }
                }).catch((error) => {
                    console.error(`Error sending job ${job.job_posting_id} to Telegram:`, error);
                    return { job_posting_id: job.job_posting_id, status: 'rejected', reason: error.message };
                });
                
                postPromises.push(postPromise);
            } else {
                console.log(`Skipping job ${job.job_posting_id} for company ${companyId}. Daily limit reached.`);
            }
        }

        const results = await Promise.allSettled(postPromises);

        return NextResponse.json({ success: true, telegram_posts: results }, { status: 200 });
    } catch (e) {
        console.error(`Error in job notifcation endpoint: ${e}`);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
