from google import genai
from .models.schemas import ResponseStructor
from .prompt.prompt_styple import SYSTEM_INSTRUCTION

MODEL = 'gemini-2.5-flash-lite'

def gate(text: str, API_KEY: str) -> ResponseStructor:
    client = genai.Client(api_key=API_KEY)
    resp = client.models.generate_content(
        model=MODEL,
        contents=text,
        config={
            "system_instruction": SYSTEM_INSTRUCTION,        # ใช้ system instruction
            "response_mime_type": "application/json",        # บังคับให้ตอบเป็น JSON
            "response_schema": ResponseStructor,                 # สคีมาด้วย Pydantic
            "temperature": 0.2
        },
    )
    return ResponseStructor.model_validate_json(resp.text)

if __name__ == "__main__":
    tests = [
        "ห้องนั่งเล่นสไตล์มินิมอล โทนไม้ อบอุ่น",
        "ถ่ายภาพนางแบบบนชายหาดยามเย็น",
        "เตียงเดี่ยวสีขาว",
        "ครัวลอฟต์ ผนังอิฐเปลือย โต๊ะกินข้าวยาว แสงอุ่น",
    ]
    for t in tests:
        print("INPUT:", t)
        out = gate(t)
        print(out.model_dump())
        print("-"*80)
