from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .filter.prompt.prompt_styple import SYSTEM_INSTRUCTION
from .filter.models.schemas import ResponseStructor
from .filter.gate_service import gate
from .filter.client import get_openai_api_key

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API = get_openai_api_key()

@app.get("/")
async def root():
    return {'status': 'ok' if API else 'error'}

@app.post("/filter")
async def filter(request: Request):
    request_json = await request.json()
    result = gate(request_json['txt'],API)
    return result if result.normalized_prompt else JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={
        "success": False,
            "error": {
                "code": 400,
                "message": result.label,
                "reason": result.reason
            }
    }
)

@app.post("/generate")
async def generate(request: Request):
    request_json = await request.json()
    return JSONResponse(request_json)
