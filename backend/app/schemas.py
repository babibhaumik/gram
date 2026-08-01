from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from app.models import ListingType, PropertyType


# ---------- Auth ----------

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone_number: str
    is_verified: bool

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    code: str


class OTPResendRequest(BaseModel):
    email: EmailStr


# ---------- Property ----------

class PropertyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    property_type: PropertyType
    listing_type: ListingType
    price: float
    area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    city: str
    address: Optional[str] = None


class PropertyOut(BaseModel):
    id: int
    owner_id: int
    owner_name: str
    owner_phone: str
    title: str
    description: Optional[str]
    property_type: PropertyType
    listing_type: ListingType
    price: float
    area_sqft: Optional[float]
    bedrooms: Optional[int]
    bathrooms: Optional[int]
    city: str
    address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
