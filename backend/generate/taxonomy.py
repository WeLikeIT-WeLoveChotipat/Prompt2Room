CATEGORY_MAP = {
    "couch": "sofa",
    "chair": "chair",
    "dining table": "table",
    "bed": "bed",
    "bench": "bench",
    "tv": "tv",
    "potted plant": "plant",   # เดิม decor → แยกเป็น plant จะค้นแม่นกว่า
    "vase": "decor",
    "clock": "decor",
    "book": "book",            # หรือ "decor" ถ้าไม่มีหมวดหนังสือในแคตตาล็อก
    "refrigerator": "refrigerator",
    "microwave": "microwave",
    "oven": "oven",
    "toaster": "toaster",
    "sink": "sink",
    "toilet": "toilet",
}

def normalize_label(label: str) -> str:
    l = label.strip().lower()
    return CATEGORY_MAP.get(l, l)

if __name__ == '__main__':
    print(normalize_label('clock'))