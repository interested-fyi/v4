from supabase import create_client, Client
import os
from dotenv import load_dotenv
import json
from bs4 import BeautifulSoup
import tiktoken

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_PROJECT_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
print("supabase url: %s", SUPABASE_URL)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

enc = tiktoken.encoding_for_model("gpt-3.5-turbo")

def query_supabase():
    # Query the Supabase table to fetch the required data
    response = supabase.table('job_training_data').select('*').execute()
    if not response.data:
        raise Exception(f"Error querying Supabase: {response}")
    return response.data

def format_data(data):
    formatted_data = []
    for item in data:
        soup = BeautifulSoup(item['source_code'])
        body = str(soup.body)
        bodyTokens = enc.encode(body)
        if (len(bodyTokens) >= 15000):
            print('skipping due to size: %s', item['url'])
            continue 
        source_code = body
        url = item['url']
        response_content = {
            "description": item.get('description', ''),
            "title": item.get('title', ''),
            "location": item.get('location', ''),
            "compensation": item.get('compensation', ''),
            "summary": item.get('summary', ''),
            "description_html": item.get('description_html', '')
        }
        messages = [
            {"role": "system", "content": "Given a source code and URL, provide the following fields in a JSON dict: description, title, location, compensation, summary, description_html."},
            {"role": "user", "content": f" URL: {url}\nSource: {source_code}"},
            {"role": "assistant", "content": json.dumps(response_content)}
        ]
        formatted_data.append({"messages": messages})
    return formatted_data

def write_to_jsonl(data, output_file):
    with open(output_file, 'w') as f:
        for entry in data:
            f.write(json.dumps(entry) + '\n')
        
def main():
    data = query_supabase()
    formatted_data = format_data(data)
    write_to_jsonl(formatted_data, 'training_1.jsonl')

if __name__ == "__main__":
    main()