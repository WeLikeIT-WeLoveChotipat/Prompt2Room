from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .filter.prompt.prompt_styple import SYSTEM_INSTRUCTION
from .filter.models.schemas import ResponseStructor # โครงสร้างข้อมูลผลลัพธ์จาก service
from .filter.gate_service import gate # ฟังก์ชันหลักกรองและประมวลผลข้อความ
from .filter.client import get_openai_api_key # ฟังก์ชันดึงค่า OpenAI API Key
from .generate.pipeline import pipeline # ฟังก์ชันหลักกรองและประมวลผลข้อความ

app = FastAPI()

# อนุญาตให้เว็บที่ระบุเรียกใช้ API ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# โหลด API Key ไว้เชื่อมกับ OpenAI
API = get_openai_api_key()

# เอาไว้เช็กว่าเซิร์ฟเวอร์ ถ้ามี API Key = ok ถ้าไม่มี = error
@app.get("/")
async def root():
    return {'status': 'ok' if API else 'error'}

@app.post("/filter")
async def filter(request: Request):
    """
    รับ JSON ที่มีฟิลด์ 'txt' แล้วส่งให้ gate ประมวลผล
    - ถ้าประมวลผลเสร็จ มี normalized_prompt >>> ส่งผลลัพธ์กลับ
    - ถ้าไม่ผ่าน >>> ส่ง 400 พร้อมสาเหตุ
    """
    request_json = await request.json()
    result = gate(request_json['txt'],API)

    #ผ่านการคัด >>> ส่งผลลัพธ์
    return result if result.normalized_prompt else JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={
        "success": False,
            "error": {
                "code": 400,
                "message": result.label, # ประเภทของข้อผิดพลาด
                "reason": result.reason # ให้ feedback กลับว่าทำไมไม่ผ่าน
            }
    }
)

@app.post("/generate")
async def generate(request: Request):
    """
    ส่งคืนข้อมูลที่รับมา
    ใช้ทดสอบว่าระบบรับ/ส่ง JSON ได้ปกติ
    """
    request_json = await request.json()
    result = pipeline(request_json['txt'],API)
    return JSONResponse(result)