import io
import os
from typing import List, Optional
from taxonomy import normalize_label
from ultralytics import YOLO
from PIL import Image
from models.schemas import Detection, BoundingBox, DetectResponse
import torch

DEVICE = os.getenv("DEVICE") or ("cuda:0" if torch.cuda.is_available() else "cpu")
HALF = bool(os.getenv("HALF", "1") == "1") and DEVICE.startswith("cuda")

YOLO_MODEL = None

def _load_yolo(model_path: Optional[str] = None):
    global YOLO_MODEL
    if YOLO_MODEL is None:
        path = model_path or os.getenv("YOLO_MODEL", "yolov8n.pt")
        m = YOLO(path)
        # ส่งโมเดลขึ้นการ์ดจอถ้ามี
        try:
            m.to(DEVICE)
        except Exception:
            pass
        YOLO_MODEL = m
    return YOLO_MODEL

def detect_items_yolo(
    image_bytes: bytes,
    score_thresh: float = 0.25,
    model_path: Optional[str] = None,
) -> List[Detection]:
    """
    Run object detection on an image and return a list of Detection.
    - image_bytes: raw image content (e.g., from UploadFile.read())
    - score_thresh: confidence threshold (0..1)
    - model_path: path to YOLO weights (defaults to env YOLO_MODEL or 'yolov8n.pt')
    """
    model = _load_yolo(model_path)

    # Open image
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Predict (Ultralytics handles NMS internally)
    # 'conf' filters low-confidence detections server-side
    result = model.predict(img, conf=score_thresh, verbose=False)[0]

    W, H = img.size
    names = result.names
    detections: List[Detection] = []

    if result.boxes is not None:
        for b in result.boxes:
            cls_id = int(b.cls.item())
            conf = float(b.conf.item())

            # xyxy -> [x1, y1, x2, y2]
            x1, y1, x2, y2 = [float(v) for v in b.xyxy[0].tolist()]

            # normalize to 0..1
            x, y = x1 / W, y1 / H
            w, h = (x2 - x1) / W, (y2 - y1) / H

            raw_label = names.get(cls_id, str(cls_id))
            label = normalize_label(str(raw_label))

            detections.append(
                Detection(
                    label=label,
                    score=conf,
                    bbox=BoundingBox(x=x, y=y, w=w, h=h),
                )
            )
    return detections


def detect_items(
    image_bytes: bytes,
    score_thresh: float = 0.25,
    model_path: Optional[str] = None,
) -> DetectResponse:
    """
    Facade ให้ FastAPI เรียกใช้งานง่าย:
    คืน DetectResponse(success, items)
    """
    items = detect_items_yolo(
        image_bytes=image_bytes,
        score_thresh=score_thresh,
        model_path=model_path,
    )
    return DetectResponse(success=True, items=items)


# -------- Demo (optional, ไม่ใช้ argparse) --------
if __name__ == "__main__":
    # DEMO_IMAGE=room.jpg YOLO_MODEL=yolov8n.pt python detect.py
    demo_path = '/home/jira-dev/WorkSpace-AumJixs/IT-KMITL/PSCP/Prompt2Room/Assets/living_room.png'

    with open(demo_path, "rb") as f:
        img_bytes = f.read()

    # แสดงผลแบบ dict
    print("DEVICE:", DEVICE, "HALF:", HALF)
    print(detect_items(img_bytes,model_path=YOLO_MODEL, score_thresh=0.25).model_dump())
