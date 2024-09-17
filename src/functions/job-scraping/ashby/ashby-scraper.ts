import chromium from "@sparticuz/chromium";
import puppeteer, { Browser } from "puppeteer-core";
import puppeteerDev, { Browser as DevBrowser } from "puppeteer";
import * as cheerio from "cheerio";
import JobPosting from "@/types/job-posting";

export default async function ashbyScraper(
  url: string,
  company_id?: number
) {

  try {
    // const { boardUrl, accountName } = await getBoardUrl(url);
    const jobPostings: JobPosting[] = [];

    //extract ashby key from url
    const ashbyKey = url.split('ashbyhq.com/')[1];

    if(!!ashbyKey) {
      // fetch from api
      const response = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${ashbyKey}?includeCompensation=true`);
      const jobs = (await response.json()).jobs;

      for (const job of jobs) { 
        const jobPosting: JobPosting = {
          department: job.department,
          sub_department: job.team,
          role_title: job.title,
          location: `${job.location}${job.secondaryLocations.length > 0 ? ', ' + job.secondaryLocations.map((location: any) => location.location).join(', ') : ''}`,
          posting_url: job.jobUrl,
          active: true,
          type: "ashby",
          company_id: company_id,
          data: job,
        }
          jobPostings.push(jobPosting);
      }
    }
    return jobPostings;
  } catch (e) {
    console.log(`Error Scraping from Ashby: ${e}`);
    return null;
  }
}
