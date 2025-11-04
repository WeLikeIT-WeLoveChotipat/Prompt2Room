import os
from dotenv import load_dotenv

load_dotenv()

def get_openai_api_key():
    return os.getenv('GEMINI_API_KEY')

def get_model_name():
    return os.getenv('GEN_MODEL')
