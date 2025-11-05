from pydantic import BaseModel, Field
from typing import List, Optional,Dict, Any, Literal

class BoundingBox(BaseModel):
    x: float = Field(ge=0, le=1)
    y: float = Field(ge=0, le=1)
    w: float = Field(ge=0, le=1)
    h: float = Field(ge=0, le=1)

class Detection(BaseModel):
    label: str
    score: float = Field(ge=0, le=1)
    bbox: Optional[BoundingBox] = None

class DetectResponse(BaseModel):
    success: bool
    items: List[Detection]
