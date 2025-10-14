from pydantic import BaseModel
from typing import Optional
import enum

class AnswerLabel(str, enum.Enum):
    INTERIOR_ROOM = "INTERIOR_ROOM"
    NOT_INTERIOR  = "NOT_INTERIOR"
    UNSURE        = "UNSURE"
    UNSAFE        = "UNSAFE"

class ResponseStructor(BaseModel):
    label: AnswerLabel
    reason: str
    normalized_prompt: Optional[str] = None