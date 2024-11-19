import { sendTweet } from "./twitter";

describe('twitter', () => {
    it('should send a tweet', async () => {
        const tweet = await sendTweet('test tweet');
        expect(tweet.success).toBe(true);
    });
});