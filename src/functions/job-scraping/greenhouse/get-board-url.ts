import puppeteer, { Browser } from "puppeteer";
import { findGreenhouseFrameSrc } from "./find-greenhouse-frame-src";
import getGreenhouseAccountName from "./get-greenhouse-account-name";

export default async function getBoardUrl(url: string) {
    let browser: Browser | undefined;
    let boardUrl: string | undefined;

    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2'});
        
        const content = await page.content();
        const src = findGreenhouseFrameSrc(content);
        const accountName = getGreenhouseAccountName(src ?? url);

        if (accountName) {
            boardUrl = `https://boards.greenhouse.io/${accountName}`;
            await page.goto(boardUrl, { waitUntil: 'networkidle2'});
            const redirectedUrl = page.url();
            if (redirectedUrl.includes('job-boards.eu.greenhouse.io') || redirectedUrl.includes('job-boards.greenhouse.io')) {
                boardUrl = redirectedUrl;
            } else if (redirectedUrl !== boardUrl) {
                boardUrl = `https://boards.greenhouse.io/embed/job_board?for=${accountName}`;
            }
        }

        return { boardUrl, accountName };
    } catch (e) {
        console.log(`Error Getting boardUrl from Greenhouse: ${e}`);
        return { boardUrl: null, accountName: null };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}