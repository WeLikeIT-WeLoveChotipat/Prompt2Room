import os
import base64
from typing import List, Literal, Tuple
from dotenv import load_dotenv
from google import genai
from google.genai import types

MODEL = "gemini-2.0-flash-preview-image-generation"

def _auto_modalities(model: str, modalities: List[Literal["Text", "Image"]] | None):
    if modalities is not None:
        return modalities
    # 2.0-preview (image-generation) ต้องขอ Text+Image
    if "2.0" in model and "image-generation" in model:
        return ["Text", "Image"]
    # รุ่นใหม่ (เช่น 2.5-flash-image) ขอ Image อย่างเดียวพอ
    return ["Image"]

def generate_images(
    prompt: str,
    API_KEY: str | None = None,
    modalities: List[Literal["Text", "Image"]] | None = None,
) -> Tuple[List[dict], str]:
    """
    เรียก Gemini ให้สร้างภาพจาก prompt แล้วรีเทิร์น:
      - images: list ของ { mime_type, b64 }
      - text:   ข้อความประกอบ (ถ้ามี)
    """
    api_key = API_KEY or os.getenv("GEMINI_API_KEY")

    use_modalities = _auto_modalities(MODEL, modalities)

    client = genai.Client(api_key=api_key)
    resp = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(response_modalities=use_modalities),
    )

    if not getattr(resp, "candidates", None):
        raise RuntimeError("Empty response from model.")

    cand = resp.candidates[0]
    if not cand or not getattr(cand, "content", None):
        raise RuntimeError("No content in candidates.")

    images: List[dict] = []
    texts: List[str] = []

    for part in cand.content.parts:
        if getattr(part, "text", None):
            texts.append(part.text)
        inline = getattr(part, "inline_data", None)
        if inline:
            mime = getattr(inline, "mime_type", "image/png")
            data = inline.data
            b64 = base64.b64encode(data).decode("ascii") if isinstance(data, (bytes, bytearray)) else data
            images.append({"mime_type": mime, "b64": b64})

    if not images:
        raise RuntimeError("Model returned no images.")

    return images, ("\n".join(texts) if texts else "")

if __name__ == "__main__":
    PROMPT = "living room interior, minimalist style, warm lighting, eye-level shot, materials: wood, featuring comfortable seating, highly detailed, photorealistic, global illumination, soft shadows, clean composition"

    print(f"Generating with model={MODEL}\nPrompt={PROMPT}\n...")
    try:
        imgs, txt = generate_images(PROMPT)
        if txt:
            print("\n--- Model text ---")
            print(txt)

        outdir = "out"
        os.makedirs(outdir, exist_ok=True)
        for i, item in enumerate(imgs):
            ext = item["mime_type"].split("/")[-1] if "/" in item["mime_type"] else "png"
            path = os.path.join(outdir, f"genimg_{i}.{ext}")
            with open(path, "wb") as f:
                f.write(base64.b64decode(item["b64"]))
            print("saved:", path)

        print(f"\nDone. Saved {len(imgs)} image(s) to ./{outdir}")
    except Exception as e:
        print("ERROR:", e)
        raise
