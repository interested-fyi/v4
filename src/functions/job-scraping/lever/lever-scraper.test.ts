import leverScraper from "./lever-scraper";

describe("leverScraper", () => {
  it("should return jobs list for risk labs", async () => {
    const url = "https://jobs.lever.co/celestia";
    const jobs = await leverScraper(url);
    expect(jobs?.length).toBeGreaterThan(0);
  }, 15000);

  it("should return jobs list for spring health", async () => {
    const url = "https://jobs.lever.co/risklabs";
    const jobs = await leverScraper(url);
    expect(jobs?.length).toBeGreaterThan(0);
  }, 15000);

  it("should be null", async () => {
    const url = "https://google.com";
    const jobs = await leverScraper(url);
    expect(jobs?.length).toBe(0);
  }, 15000);
});
