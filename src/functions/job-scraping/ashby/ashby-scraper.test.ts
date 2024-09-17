import ashbyScraper from "./ashby-scraper";

describe('ashbyScraper', () => {
    it('should return jobs list for zircuit', async () => {
      const url = 'https://jobs.ashbyhq.com/Zircuit/';
      const jobs = await ashbyScraper(url);
      expect(jobs?.length).toBeGreaterThan(0);
    }, 15000);

    it('should return jobs list for provable', async () => {
        const url = 'https://jobs.ashbyhq.com/provable';
        const jobs = await ashbyScraper(url);
        expect(jobs?.length).toBeGreaterThan(0);
    }, 15000);

    it('should return jobs list for CoW DAO', async () => {
        const url = 'https://jobs.ashbyhq.com/cow-dao/';
        const jobs = await ashbyScraper(url);
        expect(jobs?.length).toBeGreaterThan(0);
    }, 15000);

    it('should be null', async () => {
        const url = 'https://google.com';
        const jobs = await ashbyScraper(url);
        expect(jobs?.length).toBe(0);
    }, 15000);
});