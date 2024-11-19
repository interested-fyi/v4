import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config();

console.log('TWITTER_API_KEY: ', process.env.TWITTER_API_KEY);
console.log('TWITTER_API_SECRET: ', process.env.TWITTER_API_SECRET);
console.log('TWITTER_ACCESS_TOKEN: ', process.env.TWITTER_ACCESS_TOKEN);
console.log('TWITTER_ACCESS_TOKEN_SECRET: ', process.env.TWITTER_ACCESS_TOKEN_SECRET);

const client = new TwitterApi(
    //process.env.TWITTER_BEARER_TOKEN ?? "",
    {
        // clientId: process.env.TWITTER_CLIENT_ID ?? "",
        // clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
        appKey: process.env.TWITTER_API_KEY ?? "",
        appSecret: process.env.TWITTER_API_SECRET ?? "",
        accessToken: process.env.TWITTER_ACCESS_TOKEN ?? "",
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? "",
    }
);

export default client.readWrite;

export const sendTweet = async (text: string, image?: Buffer): Promise<{ success: boolean, tweetText: string, tweetId?: string, tweetUrl?: string, error?: any }> => {
    try {
        console.log('sending tweet: ', text);
        let mediaId: string | undefined = undefined;
        if(image) {
            mediaId = await client.v1.uploadMedia(image, { type: 'png' });
        }
        console.log('mediaId: ', mediaId);
        // mediaIds is a string[], can be given to .tweet
        const tweet = await client.v2.tweet({
            text: text,
            media: mediaId ? { media_ids: [mediaId] } : undefined
        });
    
        console.log('tweet sent: ', tweet);
    
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
    } catch (e) {
        console.error('error sending tweet: ', e);
        return {
            success: false,
            tweetText: text,
            error: e
        }
    }
}