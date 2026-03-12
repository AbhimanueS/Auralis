# Auralis – Mental Health & Emotional Tracking

A **MERN stack web application** focused on **mental health and emotional wellbeing**.
Auralis helps users track mood, practice calming activities, book counselling, manage routines, get study guidance, and interact with an **AI companion for emotional support**.

---

# 🚀 Features

## Authentication & Security

* Register / Login with **JWT authentication**
* Protected routes for dashboard and inner pages
* Secure backend with Express and MongoDB

---

## Dashboard

Main hub with quick navigation.

**Components**

* Welcome message: `Welcome back, {name}`
* Search bar
* Dark mode toggle
* Navigation tabs:

  * Home
  * Diary
  * AI Companion
  * Studymate
  * Routine
  * Help
  * About

**Dashboard Cards**

* Mood Checking
* Calm Corner
* Quizzes
* Counselling

---

# 🧠 Mood Checking

Tracks emotional state with a simple scale.

**Question**

```
How are you feeling right now?
```

Mood scale:

| Score | Meaning        |
| ----- | -------------- |
| 1     | Very low / sad |
| 2     | Low            |
| 3     | Neutral        |
| 4     | Good           |
| 5     | Very happy     |

Features:

* Optional note to describe feelings
* Saved via `/api/entries`
* Stored for history and reflection

---

# 🌿 Calm Corner

A space with calming activities.

### Breathing Exercise

* Animated breathing circle
* Phases:

  * Breathe In
  * Hold
  * Breathe Out
* Timer guided relaxation

### Doodle Canvas

* Freehand drawing
* Color palette
* Brush size slider
* Clear canvas option

### Water Sort Puzzle Game

Mini relaxation puzzle.

Features:

* Colorful liquid tubes
* Multiple levels
* Tap-to-select and pour
* Undo button
* Restart level
* Solved feedback

---

# 🤖 AI Companion – *Moodmate*

An AI chat assistant focused on **emotional wellbeing**.

Features:

* Chat UI with message bubbles
* Companion avatar for AI messages
* Typing indicator
* Emotional support conversation

Initial prompt:

```
Hey! How are you feeling today?
```

Behavior:

* Asks follow-up questions
* Focused on mental health topics
* Redirects if conversation goes off-topic
* Provides supportive responses

API endpoint:

```
/api/ai/chat
```

---

# 📓 Diary & Entries

Personal journaling system.

Features:

* Save mood entries
* Add diary reflections
* View recent entries
* Delete entries

Backend API:

```
/api/entries
```

---

# 📚 Studymate – Syllabus Helper

AI tool to help students organize study material.

Input:

* Paste syllabus text
* Upload `.txt` files

Output:

* Short overview
* Key topics list
* Exam-focused guidance

API endpoint:

```
/api/studymate/overview
```

AI engines:

* Gemini
* OpenAI

Fallback:

* Simple heuristic summarizer if API keys are missing.

---

# 📅 Routine Tracker

Helps maintain healthy habits.

Tracks:

### Sleep

Numeric input for hours slept.

### Daily Activities

* Make bed
* Breakfast
* School
* Lunch
* Drink water
* Dinner
* Study
* Alone time
* Family time

Displays:

* Today's points
* Total points
* Day streak 🔥

Backend API:

```
/api/routine
```

Database Model:

```
RoutineEntry
```

Stores:

* sleep hours
* activity booleans
* calculated points
* streak

---

# 👨‍⚕️ Counselling

Booking interface for professional help.

Booking Form Fields:

* Doctor name
* Designation
* Date
* Time
* Book now button

Ready to integrate with a backend booking system.

---

# 🆘 Help & Safety

Important notice:

> Auralis is **not an emergency service**.

Emergency numbers:

| Service                | Number    |
| ---------------------- | --------- |
| Police                 | 100 / 112 |
| Ambulance              | 102 / 112 |
| Fire                   | 101 / 112 |
| Child Helpline (India) | 1098      |

Users are encouraged to contact **local emergency or mental-health professionals** if needed.

---

# ℹ️ About

Auralis is designed to promote:

* emotional awareness
* self reflection
* healthy routines
* accessible mental wellbeing tools

The platform provides **non-clinical emotional**
