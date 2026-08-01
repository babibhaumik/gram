from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.otp_service import create_and_send_otp, verify_otp
from app.schemas import (
    LoginRequest,
    OTPResendRequest,
    OTPVerifyRequest,
    Token,
    UserOut,
    UserRegister,
)
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing = (
        db.query(User)
        .filter(
            (User.email == payload.email) | (User.phone_number == payload.phone_number)
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or phone number already registered",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        phone_number=payload.phone_number,
        hashed_password=hash_password(payload.password),
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    create_and_send_otp(db, user)
    return user


@router.post("/otp/verify", response_model=Token)
def verify_otp_code(payload: OTPVerifyRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_otp(db, user, payload.code):
        raise HTTPException(status_code=400, detail="Invalid or expired code")

    user.is_verified = True
    db.commit()

    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token)


@router.post("/otp/resend", status_code=status.HTTP_204_NO_CONTENT)
def resend_otp(payload: OTPResendRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    create_and_send_otp(db, user)


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Account not verified")

    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token)
