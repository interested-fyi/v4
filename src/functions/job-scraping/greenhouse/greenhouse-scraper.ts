import chromium from 'chrome-aws-lambda';
import puppeteer, { Browser } from 'puppeteer-core';
import * as cheerio from 'cheerio';
import getGreenhouseAccountName from './get-greenhouse-account-name';
import getBoardUrl from './get-board-url';
import JobPosting from '@/types/job-posting';

export default async function greenhouseScraper(url: string, company_id?: number) {
    let browser: Browser | undefined;
        
    try {
        const { boardUrl, accountName } = await getBoardUrl(url);
        const jobPostings: JobPosting[] = [];

        if (boardUrl) {
            const executablePath = await chromium.executablePath || 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
            browser = await puppeteer.launch({
                executablePath,
                args: chromium.args,
                headless: false,
            });
            const page = await browser.newPage();
            await page.goto(boardUrl, { waitUntil: 'networkidle2', timeout: 300000});
            await page.waitForSelector('body', { timeout: 300000 });
            
            const content = await page.content();
            const $ = cheerio.load(content);

            const baseUrl = boardUrl.includes('job-boards.') ? 'https://job-boards.greenhouse.io' : 'https://boards.greenhouse.io';

            const extractJobsRegular = (section: cheerio.Cheerio, parentDepartment: string, parentSubDepartment?: string) => {
                const department = section.find('h3').text().trim() || parentDepartment;
                const subDepartment = section.find('h4').text().trim() || parentSubDepartment;
    
                section.find('.opening').each((_, opening) => {
                    const role = $(opening).find('a').text().trim();
                    const location = $(opening).find('.location').text().trim();
                    let url = $(opening).find('a').attr('href') ?? '';
                    if (!url.startsWith('http')) {
                        url = `${baseUrl}${url}`;
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
                    extractJobsRegular($(childSection), department, subDepartment);
                });
            }

            const extractJobsV2 = () => {
                $('div.job-posts').each((_, jobPostSection) => {
                    const department = $(jobPostSection).find('h3.section-header').text().trim();

                    $(jobPostSection).find('tr.job-post').each((_, jobPost) => {
                        const role = $(jobPost).find('td.cell > a > p.body.body--medium').text().trim();
                        const location = $(jobPost).find('td.cell > a > p.body.body__secondary.body--metadata').text().trim();
                        let jobUrl = $(jobPost).find('td.cell > a').attr('href') ?? '';
                        if (!jobUrl.startsWith('http')) {
                            jobUrl = `${baseUrl}${jobUrl}`;
                        }

                        jobPostings.push({
                            department: department,
                            role_title: role,
                            location: location,
                            posting_url: jobUrl,
                            active: true,
                            type: 'greenhouse',
                            company_id: company_id
                        });
                    });
                });
            };
    
            // Iterate over each main section (level-0)
            if (boardUrl.includes('job-boards.')) {
                extractJobsV2();
            } else {
                $('section.level-0').each((_, section) => {
                    extractJobsRegular($(section), '');
                });
            }
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
