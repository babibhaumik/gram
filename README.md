# PropertyGram — V1

Real estate listing app, built in phases. V1 covers: registration, login, OTP
verification, adding a property, and viewing the property feed.

## Stack

- Backend: FastAPI + SQLAlchemy + PostgreSQL
- Frontend: React (Vite) + Tailwind + React Router

## Folder structure

```
propertygram/
  backend/
    app/
      main.py          # FastAPI app, CORS, router registration
      config.py         # settings loaded from .env
      database.py        # SQLAlchemy engine/session
      models.py           # User, OTP, Property ORM models
      schemas.py           # Pydantic request/response models
      security.py           # password hashing + JWT
      otp_service.py         # OTP generation/verification (mock delivery)
      deps.py                 # get_current_user dependency
      routers/
        auth.py                # register, login, otp verify/resend
        properties.py            # add property, feed
    requirements.txt
    .env.example
  frontend/
    src/
      pages/            # Login, Register, OTPVerify, Feed, AddProperty
      components/         # Navbar, PropertyCard, ProtectedRoute
      api/client.js         # axios instance with auth header
      App.jsx, main.jsx
    package.json
```

## Running the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env       # then fill in DATABASE_URL and SECRET_KEY

# create the database first, e.g.:
#   createdb propertygram

uvicorn app.main:app --reload
```

API docs will be at http://localhost:8000/docs

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

App will be at http://localhost:5173

## Notes on OTP

`otp_service.py` currently prints the code to the backend console instead of
sending a real SMS/email — that's intentional so you can develop without
signing up for Twilio/SES yet. Check your terminal after registering to see
the code. Swap out `_deliver_otp()` when you're ready to wire up a real
provider.

## What's deliberately left out of V1

Owner profiles, search/filters, favorites, chat, notifications, image
uploads, admin dashboard, AI features, and Docker are all later phases —
see the roadmap. Keeping V1 to just auth + property CRUD is on purpose.
