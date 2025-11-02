import io, base64
from typing import List, Optional, Tuple
from PIL import Image
from rembg import remove, new_session
import onnxruntime as ort  # สำคัญสำหรับเช็ค provider

from models.schemas import Detection, BoundingBox

_REMBG_SESSION = None

# เลือก providers: CUDA ก่อน แล้วค่อย CPU
_HAS_CUDA = "CUDAExecutionProvider" in ort.get_available_providers()
_PROVIDERS = ["CUDAExecutionProvider", "CPUExecutionProvider"] if _HAS_CUDA else ["CPUExecutionProvider"]

def _get_session():
    global _REMBG_SESSION
    if _REMBG_SESSION is None:
        # โมเดล: isnet-general-use เร็วและครอบจักรวาล
        try:
            _REMBG_SESSION = new_session("isnet-general-use", providers=_PROVIDERS)
        except TypeError:
            # เผื่อเวอร์ชัน rembg เก่าที่ไม่มี arg providers
            _REMBG_SESSION = new_session("isnet-general-use")
    return _REMBG_SESSION

def _clamp(v: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, v))

def _bbox_to_pixels(b: BoundingBox, W: int, H: int, pad_ratio: float) -> Tuple[int,int,int,int]:
    x, y, w, h = b.x*W, b.y*H, b.w*W, b.h*H
    px, py = w*pad_ratio, h*pad_ratio
    x1, y1 = int(round(x - px)), int(round(y - py))
    x2, y2 = int(round(x + w + px)), int(round(y + h + py))
    x1, y1 = _clamp(x1, 0, W-1), _clamp(y1, 0, H-1)
    x2, y2 = _clamp(x2, 1, W), _clamp(y2, 1, H)
    if x2 <= x1: x2 = min(W, x1+1)
    if y2 <= y1: y2 = min(H, y1+1)
    return x1, y1, x2, y2

def cutout_objects(image_bytes: bytes, detections: List[Detection],
                   pad_ratio: float = 0.04, min_side: int = 0) -> List[dict]:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    W, H = img.size
    session = _get_session()

    results: List[dict] = []
    for det in detections:
        if not det.bbox:
            continue
        x1, y1, x2, y2 = _bbox_to_pixels(det.bbox, W, H, pad_ratio)
        if min_side and ((x2-x1) < min_side or (y2-y1) < min_side):
            continue

        crop = img.crop((x1, y1, x2, y2))
        buf = io.BytesIO(); crop.save(buf, format="PNG")
        cut_bytes = remove(buf.getvalue(), session=session)  # ใช้ GPU ถ้ามี
        b64 = base64.b64encode(cut_bytes).decode("ascii")

        results.append({
            "label": det.label,
            "score": det.score,
            "bbox": det.bbox.model_dump(),
            "box_pixels": {"x1":x1,"y1":y1,"x2":x2,"y2":y2},
            "mime_type": "image/png",
            "b64": b64,
            "provider": "CUDA" if _HAS_CUDA else "CPU"
        })
    return results

if __name__ == "__main__":
    import os, json, random
    demo = '/home/jira-dev/WorkSpace-AumJixs/IT-KMITL/PSCP/Prompt2Room/out/gen_0.png'
    if not os.path.exists(demo):
        raise SystemExit("Put room.jpg or set DEMO_IMAGE=...")
    # เดโม bbox สมมุติ
    dets = [Detection(label="sofa", score=0.9, bbox=BoundingBox(x=0.1,y=0.4,w=0.5,h=0.4))]
    with open(demo, "rb") as f: img = f.read()
    outs = cutout_objects(img, dets)
    os.makedirs("out", exist_ok=True)
    for i, o in enumerate(outs):
        with open(f"out/cut_{i}.png","wb") as g:
            g.write(base64.b64decode(o["b64"]))
    print(json.dumps(outs, indent=2)[:800], "...")
