# Auralis – Mental Health & Emotional Tracking
MERN stack app focused on mental health: mood tracking, calm activities, counselling booking, study helper, routine tracking, and an AI companion for emotional support.
## Setup
### Backend
```bash
cd server
npm install
cp .env.example .env   # set MONGO_URI, JWT_SECRET, GEMINI_API_KEY / OPENAI_API_KEY (optional)
npm run dev
Runs at http://localhost:5000. Needs MongoDB (local or MONGO_URI in .env).

Frontend
cd client
npm install
npm run dev
Runs at http://localhost:3000 and proxies /api to the backend.

Wireframes / Main Screens
Sign up
Get Started form with Auralis branding:

Name, Date of birth, Gender, Email, Password
Login
Two-column layout:

Left: Auralis illustration
Right: “Login now” form (Email, Password, Forgot password), plus “Sign in with Google” button (UI only)
Dashboard

Top bar: “Welcome back, {name}”, search box, dark‑mode toggle, nav pills (Home, Diary, AI companion, Studymate, Routine, Help, About)
Left hero card: “Let’s talk about mental health” illustration image
Right grid cards (4):
Mood checking
Calm Corner
Quizzes
Counselling
Mood checking

Question: “How are you feeling right now?”
1–5 numeric buttons (1 = very low / very sad, 5 = great / very happy)
Optional note box to quickly describe what’s going on.
Calm Corner (tabbed)

Breathing tab: animated breathing circle with “Breathe in / Hold / Breathe out” phases and timer.
Doodle tab: simple drawing canvas with colors, brush size, and clear.
Water Sort tab: mini “water sort” puzzle game with colorful tubes, multiple levels, undo, and restart.
AI Companion (“Moodmate”)

Chat UI with left/right bubbles.
AI messages show a small companion icon.
The assistant starts with “Hey! How are you feeling today?” and keeps asking follow‑up questions about mood and wellbeing.
Counselling

Left panel: counselling information / reassurance text.
Right panel: “Book your appointment” form:
Doctor’s name, Designation, Date, Time, “Book now” button.
Diary

Recent entries list.
Rich‑text style area for quick reflections, saved via the entries API.
Studymate

Left: textarea to paste syllabus / exam portions or upload a .txt file.
Right: AI‑generated:
Short overview of the syllabus.
Key topics list.
Exam‑focus guidance.
Routine

Sleep schedule: hours slept (numeric input).
Daily checklist:
Make bed, Breakfast, School, Lunch, Drink water, Dinner, Study, Alone time, Family time.
Shows:
Today’s points
Total points
Day streak (consecutive days with a saved routine).
Help

Explanation that Auralis is not an emergency service.
Common emergency numbers (where they usually apply):
Police: 100 / 112
Ambulance / Medical: 102 / 112
Fire: 101 / 112
Child helpline: 1098 (India) or local child helpline
Reminder to check local emergency / mental‑health helplines.
About

Short description of Auralis and its purpose.
Features
Authentication & Security

Register / login with JWT auth.
Protected dashboard and inner routes (mood, diary, calm corner, etc.).
Dashboard

Hero “Let’s talk about mental health” illustration.
Quick navigation cards:
Mood checking
Calm Corner
Quizzes
Counselling
Mood Check

1–5 numeric mood scale:
1 = very low, 5 = great.
Optional text note.
Saves to /api/entries with mood value and note for history.
Calm Corner

Breathing: guided inhale/hold/exhale animation.
Doodle: freehand drawing canvas with color palette, brush size slider, and clear button.
Water Sort mini‑game:
Multiple levels with colorful liquid tubes.
Tap‑to‑select, tap‑to‑pour behavior.
Undo and restart buttons.
“Solved” feedback when a level is completed.
AI Companion (Mental‑wellbeing only)

Uses Gemini (and/or OpenAI) via /api/ai/chat.
System prompt keeps the assistant strictly focused on mental health and emotions:
Gently redirects if the user goes off‑topic.
Asks follow‑up questions about feelings and coping.
Short, supportive responses; not a medical professional.
Chat UI with companion avatar on AI messages and typing indicator.
Diary & Entries

/api/entries backend for saving moods + diary text.
Diary page to view and delete recent entries.
Studymate – Syllabus Helper

Frontend page to:
Paste syllabus / exam portion text.
Upload .txt / plain‑text files.
Backend endpoint /api/studymate/overview:
Tries Gemini (via GEMINI_API_KEY) or OpenAI (via OPENAI_API_KEY).
Returns:
overview: short summary.
keyTopics: list of topics.
examFocus: brief exam‑oriented advice.
Falls back to a simple heuristic summarizer if AI keys are missing.
Routine Tracker

Backend model RoutineEntry and routes /api/routine (GET/POST).
One document per user per date (YYYY-MM-DD).
Stores sleep hours, booleans for daily activities, and computed points.
GET returns today’s entry, total points, and streak (consecutive days).
Frontend page shows:
Sleep hours input.
Toggle buttons for each activity.
Today’s points, total points, and streak with a small “🔥” streak indicator.
Counselling

Frontend booking form.
Ready to be wired to a backend booking system if needed.
Help & Safety

Emergency numbers section as a quick reference.
Reminder to use local emergency services for crises.
Tech Stack
Frontend

React 18 with Vite.
React Router.
Tailwind CSS for styling.
Backend

Node.js / Express.
MongoDB / Mongoose.
JWT authentication.
@google/generative-ai (Gemini) and openai (optional) for AI features.
Environment Variables (Backend – server/.env)
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/auralis
JWT_SECRET=your-secret-key-change-in-production
# At least one of these for AI features:
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
If no AI keys are provided:
AI companion returns a config error.
Studymate falls back to a simple non‑AI summarizer.
Notes
This app is not a replacement for professional care or emergency services.
Always contact local emergency numbers or a trusted professional if you or someone else is in immediate danger.
