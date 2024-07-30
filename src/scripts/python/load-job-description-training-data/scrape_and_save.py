import asyncio
from playwright.async_api import async_playwright
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_PROJECT_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
print("supabase url: %s", SUPABASE_URL)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def scrape_and_save(url: str):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto(url, wait_until='networkidle')
            source_code = await page.content()
            await browser.close()

            response = supabase.table('job_training_data').insert({"url": url, "source_code": source_code}).execute()

            # print(response)
            if not response.data:
                print(f"Error saving data for {url}: {response.error}")
            else:
                print(f"Data saved for {url}")
    except Exception as e:
        print(f"Error scraping {url}: {e}")

async def main():
    urls = [
        'https://boards.greenhouse.io/himshers/jobs/7058975002?t=c04a450b2us',
        'https://boards.greenhouse.io/honor/jobs/7435052002?gh_jid=7435052002&gh_src=3429aeee2us',
        'https://www.charliehealth.com/careers/current-openings?gh_jid=5169655004',
        'https://jobs.ashbyhq.com/notable/6325f03a-a6b4-4a9c-924b-37381d0b1db3?gh_src=13887be82us',
        'https://boards.greenhouse.io/underdogfantasy/jobs/4423810005',
        'https://ats.comparably.com/api/v1/gh/underdogfantasy?gh_jid=4349720005',
        'https://ats.rippling.com/medallion-careers/jobs/366e888b-f2ee-4fa8-8ec2-1ac0abfa97e9?src=Rippling',
        'https://jobs.lever.co/obol-tech/6af14572-4753-4159-8cbd-80b74e65132f/',
        'https://atlas-axis.super.site/ecosystem-governance-architect?&source=web3.career',
        'https://applicantai.com/molecule/finance-operations-manager/838?ref=web3.career',
        'https://jobs.ashbyhq.com/Zircuit/64780490-7248-4e56-8d20-3c29161c6634?&source=web3.career',
        'https://jobs.ashbyhq.com/provable/b33905b9-ba4c-4fe2-9ad5-bc61e6fabba4/application?&source=web3.career',
        'https://applicantai.com/eight-forces-1/project-manager/814?ref=web3.career#apply',
        'https://jobs.ashbyhq.com/quantstamp/0deafffe-d83b-49ad-a0e9-0230659b49cf?&source=web3.career',
        'https://applicantai.com/sideshift/junior-backend-engineer/8',
        'https://jobs.lever.co/tokenmetrics/43e9d3be-a4ec-4a23-b398-e9bbca08e378/',
        'https://boards.greenhouse.io/okx/jobs/6055242003?&source=web3.career&gh_src=web3.career',
        'https://boards.greenhouse.io/eigenlabs/jobs/4440485005?&source=web3.career&gh_src=web3.career',
        'https://moonpay.wd1.myworkdayjobs.com/en-US/GTI/job/Lisbon-Portugal/Senior-Data-Analyst_JR100145?&source=web3.career',
        'https://careers.chorus.one/o/research-analyst-solana?ref=cryptocurrencyjobs.co',
        'https://jobs.lever.co/gauntlet/b95eb803-f55d-4d79-8c90-844cfec4fcc8',
        'https://jobs.lever.co/axiomzen/1a20105b-c6e9-4b92-9c2b-dafc1eb910db/?lever-origin=applied&lever-source%5B%5D=cryptocurrencyjobs.co',
        'https://www.fireblocks.com/careers/current-openings/4373071006?gh_jid=4373071006?gh_src=cryptocurrencyjobs.co',
        'https://boards.greenhouse.io/oplabs/jobs/5203858004?gh_src=cryptocurrencyjobs.co',
        'https://paxos.com/job-posts/product-lead-stablecoins/?gh_src=cryptocurrencyjobs.co',
        'https://a16z.com/about/jobs/?gh_jid=5975721003?gh_src=cryptocurrencyjobs.co',
        'https://jobs.lever.co/ledger/aacf5179-1594-4082-a1c2-967f8ffd133c?lever-origin=applied&lever-source%5B%5D=cryptocurrencyjobs.co',
        'https://jobs.ashbyhq.com/chainalysis-careers/6b3402e1-b4c8-411f-831f-fc349facf168?ref=cryptocurrencyjobs.co',
        'https://careers.berachain.com/29947',
        'https://lightcurve.jobs.personio.de/job/1613118?language=en&display=en?ref=cryptocurrencyjobs.co',
        'https://stake-capital.revolutpeople.com/public/careers/position/business-development-ops-manager-492c9f5b-bb08-4452-9b8d-dbca4969f99c?ref=cryptocurrencyjobs.co',
        'https://boards.greenhouse.io/clearmatics/jobs/6833054002?gh_src=98dfd2bd2us',
        'https://boards.greenhouse.io/logos/jobs/5997579?gh_src=201535eb1us',
        'https://jobs.ashbyhq.com/safe.global/f5a2c912-2b3c-4e31-91c9-f803bd68178f?ref=cryptocurrencyjobs.co',
        'https://usual.breezy.hr/p/687233e8735201-senior-product-manager-defi?source=cryptocurrencyjobs.co',
        'https://jobs.lever.co/injectivelabs/50b8b598-31ed-4019-98ce-2b9a149afed1'
    ]

    tasks = [scrape_and_save(url) for url in urls]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())