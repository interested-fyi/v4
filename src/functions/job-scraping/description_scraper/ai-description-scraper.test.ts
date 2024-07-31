import extractJobData from './ai-description-scraper';
require('dotenv').config();

describe('extractJobData Integration Tests', () => {
  it('should extract job data from lever and generate a response for a valid URL', async () => {
    const url = 'https://jobs.lever.co/equiphealth/0304a7ae-9eda-4560-8c59-ec562bb65a9f/';
    const response = await extractJobData(url);

    expect(response).toHaveProperty('role', 'assistant');
    expect(response?.content).toHaveProperty('description');
    expect(response?.content).toHaveProperty('title', 'Sr Full Stack Java Software Engineer - Backend Focus');
    expect(response?.content).toHaveProperty('location', 'Remote - USA');
    expect(["$127,000 - $154,000", "$135,000 - $150,000"]).toContain(response?.content.compensation);
    expect(response?.content).toHaveProperty('summary');
  }, 120000);

  it('should extract job data from greenhouse and generate a response for a valid URL', async () => {
    const url = 'https://boards.greenhouse.io/springhealth66/jobs/4435781005';
    const response = await extractJobData(url);

    expect(response).toHaveProperty('role', 'assistant');
    expect(response?.content).toHaveProperty('description');
    expect(response?.content).toHaveProperty('title', 'Senior Project Manager');
    expect(response?.content).toHaveProperty('location', 'Remote');
    expect(response?.content).toHaveProperty('compensation', '$108,700 - $141,350');
    expect(response?.content).toHaveProperty('summary');
  }, 180000);

  it('should handle non-existent URL gracefully', async () => {
    const url = 'http://nonexistent-url.com';
    const response = await extractJobData(url);

    expect(response).toHaveProperty('role', 'assistant');
    expect(response?.content.description).toBe(null);
  }, 60000);

  it('should handle URL that does not load properly', async () => {
    const url = 'http://slow-url.com';
    const response = await extractJobData(url);

    expect(response).toHaveProperty('role', 'assistant');
    expect(response?.content.description).toBe(null);
  }, 60000);

  // Add more test cases as needed
});