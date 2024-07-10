import puppeteer, { Browser } from "puppeteer";
import { findGreenhouseFrameSrc } from "./find-greenhouse-frame-src";
import getGreenhouseAccountName from "./get-greenhouse-account-name";

export default async function getEmbedUrl(url: string) {
    let browser: Browser | undefined;
    let embedUrl: string | undefined;

    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2'});
        
        const content = await page.content();
        const src = findGreenhouseFrameSrc(content);
        const accountName = getGreenhouseAccountName(url);

        if (src) {
            embedUrl = src
            return { embedUrl, accountName }
        } 
        if (accountName) {
            embedUrl = `https://boards.greenhouse.io/embed/job_board?for=${accountName}`;
        }

        console.log(`Embed URL: ${embedUrl}`)
        return { embedUrl, accountName };
    } catch (e) {
        console.log(`Error Getting embedUrl from Greenhouse: ${e}`);
        return { embedUrl: null, accountName: null };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}