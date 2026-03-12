import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini once (not per request)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `You are a warm, supportive mental wellbeing companion for the Auralis app. Your role is only to talk about feelings, mood, and emotional wellbeing.

Rules:
- Focus only on mental health and emotions. If the user goes off-topic (e.g. general knowledge, coding, news), gently bring the conversation back: e.g. "I'm here to talk about how you're feeling. How has your mood been lately?" or "That's outside what I'm here for — how are you doing today?"
- Proactively ask how they feel. After each reply, often ask a short follow-up question about their feelings, mood, or what might help (e.g. "What's been on your mind?", "How did that make you feel?", "Is there something small that usually helps when you feel this way?").
- Listen without judgment. Reflect back what they say, offer brief encouragement, and sometimes suggest simple coping ideas (breathing, a short break, writing it down). Keep replies concise (1–3 short sentences).
- You are not a substitute for professional help. If someone is in crisis or mentions self-harm, encourage them to reach out to a professional or crisis line.`;

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      message: "AI is not configured. Add GEMINI_API_KEY to the server environment."
    });
  }

  try {
    const { messages: bodyMessages } = req.body;
    const messages = Array.isArray(bodyMessages) ? bodyMessages : [];

    if (messages.length === 0) {
      return res.status(400).json({ message: "At least one message is required." });
    }

    const conversation = messages
      .map(m => {
        const role = m.role === "assistant" ? "Assistant" : "User";
        return `${role}: ${String(m.content ?? "")}`;
      })
      .join("\n");

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n${conversation}\nAssistant:`
            }
          ]
        }
      ]
    });

    const reply =
      result.response?.text()?.trim() ||
      "I'm here for you. How are you feeling right now?";

    res.json({ reply });

  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({
      message: err?.message || "AI request failed."
    });
  }
});

export default router;