import random
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MIMEText

from sqlalchemy.orm import Session

from app.config import settings
from app.models import OTP, User


def generate_otp_code() -> str:
    return f"{random.randint(0, 999999):06d}"


def create_and_send_otp(db: Session, user: User) -> OTP:
    """Creates an OTP record and 'sends' it.

    In production this would call an SMS/email provider (Twilio, SES, etc).
    For now it prints to the console so you can develop without a real
    provider — replace `_deliver_otp` when you're ready to go live.
    """
    code = generate_otp_code()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.otp_expire_minutes)

    otp = OTP(user_id=user.id, code=code, expires_at=expires_at)
    db.add(otp)
    db.commit()
    db.refresh(otp)

    _deliver_otp(user, code)
    return otp


def _deliver_otp(user: User, code: str) -> None:
    # If SMTP isn't configured, fall back to printing so local dev still works.
    if not settings.smtp_username or not settings.smtp_password:
        print(f"[OTP] (SMTP not configured) code {code} for {user.email}")
        return

    subject = "Your PropertyGram verification code"
    body = (
        f"Hi {user.full_name},\n\n"
        f"Your PropertyGram verification code is: {code}\n"
        f"It expires in {settings.otp_expire_minutes} minutes.\n\n"
        f"If you didn't request this, you can ignore this email."
    )

    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = f"{settings.smtp_from_name} <{settings.smtp_username}>"
    message["To"] = user.email

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_username, settings.smtp_password)
            server.sendmail(settings.smtp_username, [user.email], message.as_string())
        print(f"[OTP] Email sent to {user.email}")
    except Exception as exc:
        # Don't crash registration if email delivery fails — log it and let
        # the console fallback double as a safety net during development.
        print(f"[OTP] Failed to send email to {user.email}: {exc}")
        print(f"[OTP] (fallback) code {code} for {user.email}")


def verify_otp(db: Session, user: User, code: str) -> bool:
    otp = (
        db.query(OTP)
        .filter(OTP.user_id == user.id, OTP.is_used.is_(False))
        .order_by(OTP.created_at.desc())
        .first()
    )

    if not otp:
        return False
    if otp.expires_at < datetime.utcnow():
        return False
    if otp.code != code:
        return False

    otp.is_used = True
    db.commit()
    return True
