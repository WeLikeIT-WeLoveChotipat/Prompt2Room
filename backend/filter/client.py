import os
from dotenv import load_dotenv

load_dotenv()

def get_openai_api_key():
    return os.getenv('GEMINI_API_KEY') if os.getenv('GEMINI_API_KEY') else 'ไม่พบ API Key'