import puppeteer from "puppeteer";
import * as cheerio from 'cheerio';

export default async function extractJobBody(url: string) {
    let browser;
    
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 300000});
        await page.waitForSelector('body', { timeout: 300000 });
        const content = await page.content();
        const $ = cheerio.load(content);
        const body = $('body').html() || '';

        return body;
    } catch (e) {
        console.error(`Error getting job body: ${e}`);
        return null ;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}