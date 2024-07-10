import greenhouseScraper from "./greenhouse-scraper";

describe('greenhouseScraper', () => {
    it('should extract the value for "for" parameter', async () => {
      const url = 'https://underdogfantasy.com/careers#jobs';
      const src = await greenhouseScraper(url);
      expect(src).toBe('underdogfantasy');
    }, 15000);

    it('should extract the value for "for" parameter', async () => {
        const url = 'https://boards.greenhouse.io/springhealth66';
        const src = await greenhouseScraper(url);
        expect(src).toBe('asdfasdf');
      }, 15000);
});