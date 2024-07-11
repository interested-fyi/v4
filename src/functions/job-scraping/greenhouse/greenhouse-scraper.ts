import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import { findGreenhouseFrameSrc } from './find-greenhouse-frame-src'
import getGreenhouseAccountName from './get-greenhouse-account-name';
import getEmbedUrl from './get-embed-url';
import JobPosting from '@/types/job-posting';

export default async function greenhouseScraper(url: string) {
    let browser: Browser | undefined;
    let embedUrl: string | undefined;
        
    try {
        const { embedUrl, accountName } = await getEmbedUrl(url);
        const jobPostings: JobPosting[] = [];

        if (embedUrl) {
            browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(embedUrl, { waitUntil: 'networkidle2'});
            
            const content = await page.content();
            const $ = cheerio.load(content);

            const extractJobs = (section: cheerio.Cheerio, parentDepartment: string, parentSubDepartment?: string) => {
                const department = section.find('h3').text().trim() || parentDepartment;
                const subDepartment = section.find('h4').text().trim() || parentSubDepartment;
    
                section.find('.opening').each((_, opening) => {
                    const role = $(opening).find('a').text().trim();
                    const location = $(opening).find('.location').text().trim();
                    const url = $(opening).find('a').attr('href') ?? '';
    
                    jobPostings.push({
                        department,
                        subDepartment,
                        role,
                        location,
                        url,
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
