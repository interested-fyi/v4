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
        const accountName = getGreenhouseAccountName(url);

        if (src) {
            boardUrl = src
            return { boardUrl, accountName }
        } 
        if (accountName) {

            boardUrl = `https://boards.greenhouse.io/embed/job_board?for=${accountName}`;
        }

        console.log(`Embed URL: ${boardUrl}`)
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