'use client'
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

const TelegramReferralPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get('userId');
  const jobId = searchParams.get('jobId');
  const chatName = searchParams.get('chatName');
  const msgId = searchParams.get('msgId');

  useEffect(() => {
    if (userId && jobId && chatName && msgId) {
      const telegramPostUrl = `https://t.me/${chatName}/${msgId}`
      const logReferralClick = async () => {
        try {
          await fetch('/api/referrals/telegram', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              jobId,
              telegramPostUrl
            }),
          });
        } catch (error) {
          console.error('Error logging referral click:', error);
        }
      };

      logReferralClick();

      // Redirect to the provided URL after logging
      router.replace(telegramPostUrl);
    }
  }, [userId, jobId, chatName, msgId, router]);

  return null; // Optionally, show a loading indicator here

};

const TelegramReferralPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TelegramReferralPageContent />
  </Suspense>
); 

export default TelegramReferralPage;