import chromium from '@sparticuz/chromium';
import puppeteer, { Browser } from 'puppeteer-core';
import puppeteerDev, { Browser as DevBrowser } from 'puppeteer';
import * as cheerio from 'cheerio';
import getGreenhouseAccountName from './get-greenhouse-account-name';
import getBoardUrl from './get-board-url';
import JobPosting from '@/types/job-posting';

export default async function greenhouseScraper(url: string, company_id?: number) {
    let browser: Browser | DevBrowser | undefined;
        
    try {
        const { boardUrl, accountName } = await getBoardUrl(url);
        const jobPostings: JobPosting[] = [];
        const processedUrls = new Set();

        if (boardUrl) {
            // Uncomment for development
            // if (process.env.NODE_ENV === 'development') {
            //     console.log(`using development puppeteer`)
            //     browser = await puppeteerDev.launch();
            // } else {
            //     console.log(`using production puppeteer`)
            //     browser = await puppeteer.launch({
            //         args: chromium.args,
            //         defaultViewport: chromium.defaultViewport,
            //         executablePath: await chromium.executablePath(),
            //         headless: true,
            //         ignoreHTTPSErrors: true,
            //       });
            // }

            // comment for development
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: true,
                ignoreHTTPSErrors: true,
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
    
                const openings = section.find('.opening').toArray();

                for (const opening of openings) {
                    const role = $(opening).find('a').text().trim();
                    const location = $(opening).find('.location').text().trim();
                    let url = $(opening).find('a').attr('href') ?? '';
                    if (!url.startsWith('http')) {
                        url = `${baseUrl}${url}`;
                    }

                    if(!processedUrls.has(url)) {
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

                        processedUrls.add(url);
                    } else {
                        console.log(`Skipping duplicate scraped job: ${url}`)
                    }
                };
    
                // Recursively handle child sections
                section.find('section.child').each((_, childSection) => {
                    extractJobsRegular($(childSection), department, subDepartment);
                });
            }

            const extractJobsV2 = () => {
                $('div.job-posts').each((_, jobPostSection) => {
                    const department = $(jobPostSection).find('h3.section-header').text().trim();
                    
                    const jobPosts = $(jobPostSection).find('tr.job-post').toArray();
                    for (const jobPost of jobPosts) {
                        const role = $(jobPost).find('td.cell > a > p.body.body--medium').text().trim();
                        const location = $(jobPost).find('td.cell > a > p.body.body__secondary.body--metadata').text().trim();
                        let jobUrl = $(jobPost).find('td.cell > a').attr('href') ?? '';
                        if (!jobUrl.startsWith('http')) {
                            jobUrl = `${baseUrl}${jobUrl}`;
                        }

                        if (!processedUrls.has(jobUrl)) {
                            jobPostings.push({
                                department: department,
                                role_title: role,
                                location: location,
                                posting_url: jobUrl,
                                active: true,
                                type: 'greenhouse',
                                company_id: company_id
                            });

                            processedUrls.add(jobUrl)
                        } else {
                            console.log(`Skipping duplicate scraped job: ${url}`)
                        }
                    };
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
