import getGreenhouseAccountName from './get-greenhouse-account-name';

describe('getGreenhouseAccountName', () => {
    it('should extract the value for "for" parameter', () => {
      const url = 'https://boards.greenhouse.io/embed/job_board?for=underdogfantasy&amp;b=https%3A%2F%2Funderdogfantasy.com%2Fcareers';
      expect(getGreenhouseAccountName(url)).toBe('underdogfantasy');
    });
  
    it('should extract the first path segment after the main URL for case 2', () => {
      const url = 'https://boards.greenhouse.io/springhealth66?t=a8d055a25us';
      expect(getGreenhouseAccountName(url)).toBe('springhealth66');
    });
  
    it('should extract the first path segment after the main URL for case 3', () => {
      const url = 'https://boards.greenhouse.io/alto/jobs/6019582?gh_jid=6019582';
      expect(getGreenhouseAccountName(url)).toBe('alto');
    });
  
    it('should extract the first path segment after the main URL for case 4', () => {
      const url = 'https://boards.greenhouse.io/honor/jobs/7435052002?gh_jid=7435052002&gh_src=3429aeee2us';
      expect(getGreenhouseAccountName(url)).toBe('honor');
    });
  
    it('should return null for invalid URL', () => {
      const url = 'invalid-url';
      expect(getGreenhouseAccountName(url)).toBeNull();
    });
});