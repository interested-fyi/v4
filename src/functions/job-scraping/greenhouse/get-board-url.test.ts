import getBoardUrl from './get-board-url';

describe('getEmbedUrl', () => {
    it('should return the correct embed URL for https://underdogfantasy.com/careers#jobs', async () => {
        const url = 'https://underdogfantasy.com/careers#jobs';
        const expected = 'https://boards.greenhouse.io/embed/job_board?for=underdogfantasy&b=https%3A%2F%2Funderdogfantasy.com%2Fcareers';
        const result = await getBoardUrl(url);
        expect(result).toBe(expected);
    }, 15000);

    it('should return the correct embed URL for https://boards.greenhouse.io/springhealth66/jobs/4438591005', async () => {
        const url = 'https://boards.greenhouse.io/springhealth66/jobs/4438591005';
        const expected = 'https://boards.greenhouse.io/embed/job_board?for=springhealth66';
        const result = await getBoardUrl(url);
        expect(result).toBe(expected);
    }, 15000);

    it('should return the correct embed URL for https://boards.greenhouse.io/honor/jobs/7435052002?gh_jid=7435052002&gh_src=3429aeee2us', async () => {
        const url = 'https://boards.greenhouse.io/honor/jobs/7435052002?gh_jid=7435052002&gh_src=3429aeee2us';
        const expected = 'https://boards.greenhouse.io/embed/job_board?for=honor';
        const result = await getBoardUrl(url);
        expect(result).toBe(expected);
    }, 15000);

    it('should return the correct embed URL for https://boards.greenhouse.io/springhealth66', async () => {
        const url = 'https://boards.greenhouse.io/springhealth66';
        const expected = 'https://boards.greenhouse.io/embed/job_board?for=springhealth66';
        const result = await getBoardUrl(url);
        expect(result).toBe(expected);
    }, 15000);

    it('should return the correct embed URL for https://boards.greenhouse.io/himshers/jobs/7471027002?gh_src=c04a450b2us', async () => {
        const url = 'https://boards.greenhouse.io/himshers/jobs/7471027002?gh_src=c04a450b2us';
        const expected = 'https://boards.greenhouse.io/embed/job_board?for=himshers';
        const result = await getBoardUrl(url);
        expect(result).toBe(expected);
    }, 15000);

    it('should return the correct embed URL for https://boards.greenhouse.io/himshers?t=c04a450b2us', async () => {
        const url = 'https://boards.greenhouse.io/himshers?t=c04a450b2us';
        const expected = 'https://boards.greenhouse.io/embed/job_board?for=himshers';
        const result = await getBoardUrl(url);
        expect(result).toBe(expected);
    }, 15000);

    it('should return null for an invalid URL', async () => {
        const url = 'https://invalidurl.com';
        const result = await getBoardUrl(url);
        expect(result).toBeNull();
    }, 15000);
});