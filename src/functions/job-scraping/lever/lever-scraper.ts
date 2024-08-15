import chromium from "@sparticuz/chromium";
import puppeteer, { Browser } from "puppeteer-core";
import puppeteerDev, { Browser as DevBrowser } from "puppeteer";
import * as cheerio from "cheerio";

import JobPosting from "@/types/job-posting";

export default async function leverScraper(url: string, company_id?: number) {
  let browser: Browser | DevBrowser | undefined;

  try {
    const jobPostings: JobPosting[] = [];

    if (url) {
      // Uncomment for development
      // Choose the correct puppeteer setup
      //   if (process.env.NODE_ENV === "development") {
      //     console.log(`using development puppeteer`);
      //     browser = await puppeteerDev.launch();
      //   } else {
      //     console.log(`using production puppeteer`);
      //     browser = await puppeteer.launch({
      //       args: chromium.args,
      //       defaultViewport: chromium.defaultViewport,
      //       executablePath: await chromium.executablePath(),
      //       headless: true,
      //       ignoreHTTPSErrors: true,
      //     });
      //   }

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

      const extractJobs = () => {
        $(".postings-group").each((_, postingGroup) => {
          const department = $(postingGroup)
            .find(".posting-category-title")
            .text()
            .trim();

          $(postingGroup)
            .find(".posting")
            .each((_, posting) => {
              const role = $(posting)
                .find("h5[data-qa='posting-name']")
                .text()
                .trim();
              const location = $(posting)
                .find(".posting-categories .location")
                .text()
                .trim();
              const jobUrl =
                $(posting).find("a.posting-title").attr("href") || "";

              jobPostings.push({
                department,
                role_title: role,
                location,
                posting_url: jobUrl,
                active: true,
                type: "lever", // You can change this type based on the board
                company_id,
              });
            });
        });
      };

      // Call the job extraction function
      extractJobs();
    }

    return jobPostings;
  } catch (e) {
    console.log(`Error Scraping from the custom board: ${e}`);
    return null;
  } finally {
    if (browser) {
      browser.close();
    }
  }
}
