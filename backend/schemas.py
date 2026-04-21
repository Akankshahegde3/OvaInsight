from typing import Optional
from pydantic import BaseModel, Field


class LifestyleInput(BaseModel):
    # -------- Basic Information --------
    age: int = Field(..., ge=10, le=60)
    height: float = Field(..., gt=50, le=250)  # cm
    weight: float = Field(..., gt=20, le=200)  # kg
    cycle_length: int = Field(..., ge=15, le=90)

    # -------- Binary Inputs (0 or 1 only) --------
    weight_gain: int = Field(..., ge=0, le=1)
    hair_growth: int = Field(..., ge=0, le=1)
    hair_loss: int = Field(..., ge=0, le=1)
    pimples: int = Field(..., ge=0, le=1)
    skin_darkening: int = Field(..., ge=0, le=1)
    fast_food: int = Field(..., ge=0, le=1)
    regular_exercise: int = Field(..., ge=0, le=1)

    # -------- Optional Clinical Inputs --------
    lh: Optional[float] = Field(None, ge=0, le=50)
    fsh: Optional[float] = Field(None, ge=0, le=50)
    amh: Optional[float] = Field(None, ge=0, le=20)
    fasting_sugar: Optional[float] = Field(None, ge=50, le=300)