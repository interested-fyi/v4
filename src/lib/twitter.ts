import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN ?? "");

export default client;

export const sendTweet = async (text: string, image?: Buffer): Promise<{ success: boolean, tweetText: string, tweetId?: string, tweetUrl?: string, error?: any }> => {
    console.log('sending tweet', text);
    let mediaId: string | undefined = undefined;
    if(image) {
        mediaId = await client.v1.uploadMedia(image, { type: 'png' });
    }
  
    // mediaIds is a string[], can be given to .tweet
    const tweet = await client.v2.tweet({
        text: text,
        media: { media_ids: mediaId ? [mediaId] : undefined }
    });

    console.log('tweet sent', tweet);

    if(!tweet.errors) {
        return {
            success: false,
            tweetText: text,
            error: tweet.errors
        };
    }

    return {
        success: true,
        tweetId: tweet.data.id,
        tweetUrl: `https://x.com/interestedfyi/status/${tweet.data.id}`,
        tweetText: tweet.data.text,
    };
}