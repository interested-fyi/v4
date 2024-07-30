import asyncio
from playwright.async_api import async_playwright
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from bs4 import BeautifulSoup

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_PROJECT_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
print("supabase url: %s", SUPABASE_URL)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_source_code(url: str):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto(url, wait_until='networkidle')
            await page.wait_for_selector('body', timeout=60000)
            await asyncio.sleep(10)
            source_code = await page.content()
            soup = BeautifulSoup(source_code, 'html.parser')
            body = str(soup.body)
            # print('BODY: %s', body)
            await browser.close()

            response = supabase.table('job_training_data').upsert({"url": url, "source_code": body}, on_conflict=['url']).execute()

            # print(response)
            if not response.data:
                print(f"Error saving data for {url}: {response.error}")
            else:
                print(f"Data saved for {url}\nBody: {response.data}")
    except Exception as e:
        print(f"Error scraping {url}: {e}")

async def main():
    urls = [
        'https://jobs.lever.co/equiphealth/0304a7ae-9eda-4560-8c59-ec562bb65a9f/',
        'https://goodrx.wd1.myworkdayjobs.com/Careers/job/San-Francisco-CA/Sr-Data-Engineer-I_JR100260?source=LinkedIn',
        'https://reveleer.breezy.hr/p/9a5cbfadc735-full-stack-software-engineer?state=published',
        'https://ensemblehp.wd5.myworkdayjobs.com/en-US/EnsembleHealthPartnersCareers/job/Remote---Nationwide/Engineer-II--Technology_R021218?source=Linkedin',
        'https://job-boards.greenhouse.io/hs/jobs/5842985?gh_src=9bca6baa1us'
    ]

    tasks = [get_source_code(url) for url in urls]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())