import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
// import puppeteerDev from 'puppeteer';
import * as cheerio from "cheerio";

export default async function extractJobBody(url: string) {
  let browser;

  try {
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
    await page.goto(url, { waitUntil: "networkidle2", timeout: 300000 });
    await page.waitForSelector("body", { timeout: 300000 });
    const content = await page.content();
    const $ = cheerio.load(content);
    const body = $("body").html() || "";

    return body;
  } catch (e) {
    console.error(`Error getting job body: ${e}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
