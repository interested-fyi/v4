import sendDirectCast from './send-direct-cast';

describe('Warpcast API', () => {
    it('should send a direct message and verify success', async () => {
        const recipientFid = 188955;
        const message = 'Testing direct messages';

        const success = await sendDirectCast(recipientFid, message);

        expect(success).toBe(true);
    });
});