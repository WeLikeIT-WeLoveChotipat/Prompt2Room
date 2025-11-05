from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .filter.gate_service import gate # ฟังก์ชันหลักกรองและประมวลผลข้อความ
from .filter.client import get_openai_api_key, get_model_name # ฟังก์ชันดึงค่า OpenAI API Key
from .generate.pipeline import pipeline # ฟังก์ชันหลักกรองและประมวลผลข้อความ
from supabase import create_client, Client
from dotenv import load_dotenv

import os
import json

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env")

supabase: Client = create_client(SUPABASE_URL, SERVICE_KEY)

app = FastAPI()

# อนุญาตให้เว็บที่ระบุเรียกใช้ API ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API = get_openai_api_key()
MODEL= get_model_name()

@app.get("/")
async def root():
    return {"status": "ok" if API else "error"}


@app.post("/filter")
async def filter_prompt(request: Request):
    req_json = await request.json()
    result = gate(req_json["txt"], API)

    if result.normalized_prompt:
        return result

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "error": {
                "code": 400,
                "message": result.label,
                "reason": result.reason,
            },
        },
    )


@app.post("/generate")
async def generate(request: Request):
    try:
        req_json = await request.json()
        original_prompt = req_json["original_prompt"]
        user_id = req_json.get("user_id")

        result = pipeline(req_json["txt"], API,model=MODEL)

        image_url = None
        categories = []

        if isinstance(result, tuple):
            first = result[0]

            if isinstance(first, dict):
                mime = first.get("mime_type", "image/png")
                b64 = first.get("b64")
                if b64:
                    image_url = f"data:{mime};base64,{b64}"

            elif isinstance(first, str) and first.strip().startswith("{"):
                try:
                    d = json.loads(first.replace("'", '"'))
                    mime = d.get("mime_type", "image/png")
                    b64 = d.get("b64")
                    if b64:
                        image_url = f"data:{mime};base64,{b64}"
                except Exception:
                    image_url = None

            if len(result) > 1 and isinstance(result[1], list):
                categories.extend(result[1])
            if len(result) > 2 and isinstance(result[2], list):
                categories.extend(result[2])

        elif isinstance(result, list):
            for p in result:
                if isinstance(p, dict) and ("b64" in p or "mime_type" in p):
                    mime = p.get("mime_type", "image/png")
                    b64 = p.get("b64")
                    if b64:
                        image_url = f"data:{mime};base64,{b64}"
                elif isinstance(p, list):
                    categories.extend(p)

        payload = {
            "user_id": user_id,
            "prompt": original_prompt,
            "image_url": image_url,
            "categories": categories,
        }

        res = supabase.table("prompts").insert(payload).execute()
        return {"status": "ok", "data": res.data}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)},
        )
