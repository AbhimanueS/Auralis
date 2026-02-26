import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini once (not per request)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `You are a warm, supportive AI companion for the Auralis mental health app. You listen without judgment, offer gentle encouragement, and sometimes suggest simple coping strategies (breathing, journaling, taking a break). Keep responses concise and kind. You are not a substitute for professional help; if someone is in crisis, encourage them to reach out to a professional or crisis line.`;

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

    // Format conversation history
    const conversation = messages
      .map(m => {
        const role = m.role === "assistant" ? "Assistant" : "User";
        return `${role}: ${String(m.content ?? "")}`;
      })
      .join("\n");

    // Gemini request (correct structured format)
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
      "I'm here. How can I support you today?";

    res.json({ reply });

  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({
      message: err?.message || "AI request failed."
    });
  }
});

export default router;