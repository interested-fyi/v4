import extractJobBody from "./extract-job-body";

describe('extractJobBody Integration Tests', () => {
    it('should extract body content successfully', async () => {
      const result = await extractJobBody('https://example.com');
  
      // Check if the body contains expected content (you need to know what to expect)
      expect(result.body).toContain('<h1>Example Domain</h1>');
    }, 20000);
  
    it('should handle non-existent URL gracefully', async () => {
      const result = await extractJobBody('http://nonexistent-url');
  
      expect(result.body).toBeNull();
    }, 20000);

    it('should get body of job detail page', async () => {
        const result = await extractJobBody('https://jobs.lever.co/equiphealth/0304a7ae-9eda-4560-8c59-ec562bb65a9f/');
    
        expect(result.body).toContain('Sr Full Stack Java Software Engineer - Backend Focus');
    }, 20000);
  
    it('should handle URL that does not load properly', async () => {
      const result = await extractJobBody('http://slow-url.com');
  
      expect(result.body).toBeNull();
    }, 20000);
  });