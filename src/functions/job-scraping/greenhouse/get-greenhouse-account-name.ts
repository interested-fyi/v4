export default function getGreenhouseAccountName(url: string) {
    try {
        const urlObj = new URL(url);
        
        if (urlObj.pathname === '/embed/job_board') {
          return urlObj.searchParams.get('for');
        }
    
        const pathSegments = urlObj.pathname.split('/').filter(segment => segment);
        if (pathSegments.length > 0) {
          return pathSegments[0];
        }
    
        return null;
      } catch (error) {
        console.error('Invalid URL:', error);
        return null;
      }
}