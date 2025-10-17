from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONRespons
# from .filter.prompt.prompt_styple import SYSTEM_INSTRUCTION
# from .filter.models.schemas import ResponseStructor
# from .filter.gate_service import gate
# from .filter.client import get_openai_api_key

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API = get_openai_api_key()

@app.get("/")
async def root():
    return {"message": "ไอดำ.api"}

# @app.post("/filter")
# async def filter(request: Request):
#     request_json = await request.json()
#     result = gate(request_json['txt'],API)
#     return result