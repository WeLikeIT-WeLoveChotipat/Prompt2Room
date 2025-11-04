import os
import base64
from typing import Optional, Literal, Dict, Any, List
from dotenv import load_dotenv
from .generate import generate_images
from .detection import detect_items
from .cutout import cutout_objects
from .embedding import img2search

def _b64_to_bytes(b64_or_bytes) -> bytes:
    if isinstance(b64_or_bytes, (bytes, bytearray)):
        return bytes(b64_or_bytes)
    return base64.b64decode(b64_or_bytes)

def generate_detect_cutout(
    prompt: str,
    *,
    api_key: Optional[str] = None,
    run_on: Literal["first", "all"] = "first",
    score_thresh: float = 0.25,
    pad_ratio: float = 0.04,
    min_side: int = 0,
    yolo_model_path: Optional[str] = "yolov8n.pt",
    model="gemini-2.0-flash-preview-image-generation",
) -> Dict[str, Any]:
    """
    1) สร้างภาพจาก Gemini
    2) รัน YOLO ตรวจจับวัตถุ
    3) ตัดพื้นหลังเฉพาะชิ้นด้วย rembg
    รีเทิร์นเป็น JSON พร้อม base64 ของรูปและชิ้นที่ตัดแล้ว
    """
    images, model_text = generate_images(prompt, API_KEY=api_key,MODEL=model)

    if not images:
        return {"success": False, "reason": "no_image_generated"}

    # เลือกรูปที่จะประมวลผลต่อ
    idxs: List[int] = list(range(len(images))) if run_on == "all" else [0]

    results = []
    for i in idxs:
        img_obj = images[i]
        mime = img_obj.get("mime_type", "image/png")
        raw  = _b64_to_bytes(img_obj["b64"])

        det_resp = detect_items(
            image_bytes=raw,
            score_thresh=score_thresh,
            model_path=yolo_model_path,
        )
        detections = [d.model_dump() for d in det_resp.items]

        cutouts = cutout_objects(
            image_bytes=raw,
            detections=det_resp.items,
            pad_ratio=pad_ratio,
            min_side=min_side,
        )

        results.append({
            "index": i,
            "image": {"mime_type": mime, "b64": img_obj["b64"]},
            "detections": detections,
            "cutouts": cutouts,
        })

    return {
        "success": True,
        "prompt": prompt,
        "generated_count": len(images),
        "processed_count": len(results),
        "model_text": model_text or None,
        "results": results
    }

def pipeline(prompt: str,api_key: str,model: str):
    RUN_ON = "first"
    YOLO = "yolov8n.pt"
    THRESH = 0.35
    PAD = 0.12
    MINSZ = 0

    MODEL = 'gemini-2.5-flash-image' if model.lower().strip() == 'gemini-2.5-flash-image' else "gemini-2.0-flash-preview-image-generation"

    out = generate_detect_cutout(
        prompt=prompt,
        run_on=RUN_ON if RUN_ON in ("first", "all") else "first",
        score_thresh=THRESH,
        pad_ratio=PAD,
        min_side=MINSZ,
        yolo_model_path=YOLO,
        api_key=api_key,
        model=MODEL
    )
    furniture = []
    for i in out['results'][0]['cutouts']:
        for l, v in i.items():
            if l == 'label':
                label = v
            if l == 'b64':
                furniture.append({'label': label, 'b64': v})

    furniture_out = [img2search(path=i.get('b64') ,label=i.get('label')) for i in furniture]
    base64_image = out[0]['image']['b64']  if MODEL == 'gemini-2.5-flash-image' else out["results"][0]['image']
    return base64_image, *furniture_out


if __name__ == "__main__":
    load_dotenv()

    PROMPT = "Photo of a modern kitchen interior, featuring sleek cabinetry with minimalist design, dark marble countertops, and polished metal appliances. The space showcases warm wooden bar stools adjacent to the island and a touch of greenery from the potted plant on a shelf. Natural light filters through large windows, casting soft shadows that enhance textures. Captured from a wide angle, highlighting the open layout and intricate details of the materials used, emphasizing a sophisticated yet cozy atmosphere."
    RUN_ON = "first"
    YOLO = "yolov8n.pt"
    THRESH = 0.4
    PAD = 0.12
    MINSZ = 0

    out = generate_detect_cutout(
        prompt=PROMPT,
        run_on=RUN_ON if RUN_ON in ("first", "all") else "first",
        score_thresh=THRESH,
        pad_ratio=PAD,
        min_side=MINSZ,
        yolo_model_path=YOLO,
        api_key=os.getenv("GEMINI_API_KEY"),
    )
    furniture = []
    for i in out['results'][0]['cutouts']:
        for l, v in i.items():
            if l == 'label':
                label = v
            if l == 'b64':
                furniture.append({'label': label, 'b64': v})

    furniture_out = [img2search(path=i.get('b64') ,label=i.get('label')) for i in furniture]

    os.makedirs("out", exist_ok=True)
    for res in out.get("results", []):
        with open(f"out/gen_{res['index']}.png", "wb") as f:
            f.write(base64.b64decode(res["image"]["b64"]))
        for j, item in enumerate(res["cutouts"]):
            with open(f"out/cut_{res['index']}_{j}.png", "wb") as g:
                g.write(base64.b64decode(item["b64"]))