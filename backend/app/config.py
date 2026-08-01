from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 60
    otp_expire_minutes: int = 5
    algorithm: str = "HS256"

    # SMTP settings for sending real OTP emails.
    # Leave smtp_username unset to keep the old console-print behavior.
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_name: str = "PropertyGram"

    class Config:
        env_file = ".env"


settings = Settings()
