import { InlineKeyboard } from 'grammy';
import sendMessage from './send-message';

describe('getEmbedUrl', () => {
    it('should return the correct embed URL for https://underdogfantasy.com/careers#jobs', async () => {
        const result = await sendMessage('@interestedfyi_beta', 'Testing Again', 'HTML', new InlineKeyboard().text('Refer a Friend', 'referral').text('Apply Now', 'apply'));
        expect(result?.text).toBe('Testing Again');
    }, 15000);
});