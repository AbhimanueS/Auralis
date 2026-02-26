# Auralis – Mental Health & Emotional Tracking

MERN stack app with JWT auth, dashboard, mood tracking, calm corner, counselling booking, and AI companion.

## Setup

### Backend

```bash
cd server
npm install
cp .env.example .env   # set MONGO_URI and JWT_SECRET
npm run dev
```

Runs at `http://localhost:5000`. Needs MongoDB (local or `MONGO_URI` in `.env`).

### Frontend

```bash
cd client
npm install
npm run dev
```

Runs at `http://localhost:3000` and proxies `/api` to the backend.

## Wireframes

- **Sign up**: Get Started form (Name, DOB, Gender, Email, Password) with Auralis branding.
- **Login**: Login now with Email, Password, Forgot password, and Sign in with Google.
- **Dashboard**: Welcome back, search bar, nav (Home, AI companion, Studymate, Help, About), “Let’s talk about mental health” area, and four cards: Mood checking, Calm Corner, Quizzes, Counselling.
- **Counselling**: Left panel with Counselling info, right panel “Book your appointment” (Doctor’s name, Designation, Date, Time, Book now).

## Features

- JWT auth (register/login), protected dashboard.
- Dashboard with quick log area and navigation to Mood, Calm Corner, Quizzes, Counselling, AI companion.
- Mood check (1–5 scale / emojis), Calm Corner (breathing), Counselling booking form, AI chat UI (backend hook ready).
