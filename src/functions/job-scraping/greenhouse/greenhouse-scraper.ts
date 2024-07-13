import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import getGreenhouseAccountName from './get-greenhouse-account-name';
import getBoardUrl from './get-board-url';
import JobPosting from '@/types/job-posting';

export default async function greenhouseScraper(url: string, company_id?: number) {
    let browser: Browser | undefined;
    let boardUrl: string | undefined;
        
    try {
        const { boardUrl, accountName } = await getBoardUrl(url);
        const jobPostings: JobPosting[] = [];

        if (boardUrl) {
            browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(boardUrl, { waitUntil: 'networkidle2'});
            
            const content = await page.content();
            const $ = cheerio.load(content);

            const extractJobs = (section: cheerio.Cheerio, parentDepartment: string, parentSubDepartment?: string) => {
                const department = section.find('h3').text().trim() || parentDepartment;
                const subDepartment = section.find('h4').text().trim() || parentSubDepartment;
    
                section.find('.opening').each((_, opening) => {
                    const role = $(opening).find('a').text().trim();
                    const location = $(opening).find('.location').text().trim();
                    let url = $(opening).find('a').attr('href') ?? '';
                    if (!url.startsWith('http')) {
                        url = `https://boards.greenhouse.io${url}`;
                    }
    
                    jobPostings.push({
                        department: department,
                        sub_department: subDepartment,
                        role_title: role,
                        location: location,
                        posting_url: url,
                        active: true,
                        type: 'greenhouse',
                        company_id: company_id                        
                    });
                });
    
                // Recursively handle child sections
                section.find('section.child').each((_, childSection) => {
                    extractJobs($(childSection), department, subDepartment);
                });
            }
    
            // Iterate over each main section (level-0)
            $('section.level-0').each((_, section) => {
                extractJobs($(section), '');
            });
        }

        return jobPostings;
    } catch (e) {
        console.log(`Error Scraping from Greenhouse: ${e}`);
        return null;
    } finally {
        if (browser) {
            browser.close();
        }
    }
}
