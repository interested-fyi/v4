import { useEffect } from 'react';
import { useRouter } from 'next/router';

const TelegramReferralPage = () => {
  const router = useRouter();
  const { userId, jobId, url } = router.query;

  useEffect(() => {
    console.log(`User Id: ${userId} / jobId: ${jobId} / url: ${url}`);
    if (userId && jobId && url) {
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
              url,
            }),
          });
        } catch (error) {
          console.error('Error logging referral click:', error);
        }
      };

      logReferralClick();

      // Redirect to the provided URL after logging
      const decodedUrl = decodeURIComponent(url as string);
      router.replace(decodedUrl);
    }
  }, [userId, jobId, url, router]);

  return null; // Optionally, show a loading indicator here
};

export default TelegramReferralPage;