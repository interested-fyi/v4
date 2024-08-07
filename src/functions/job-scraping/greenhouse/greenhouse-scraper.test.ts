import greenhouseScraper from "./greenhouse-scraper";

describe('greenhouseScraper', () => {
    it('should return jobs list for underdogfantasy', async () => {
      const url = 'https://underdogfantasy.com/careers#jobs';
      const jobs = await greenhouseScraper(url);
      expect(jobs?.length).toBeGreaterThan(0);
    }, 15000);

    it('should return jobs list for spring health', async () => {
        const url = 'https://boards.greenhouse.io/springhealth66';
        const jobs = await greenhouseScraper(url);
        expect(jobs?.length).toBeGreaterThan(0);
    }, 15000);

    it('should be null', async () => {
        const url = 'https://google.com';
        const jobs = await greenhouseScraper(url);
        expect(jobs?.length).toBe(0);
    }, 15000);
});