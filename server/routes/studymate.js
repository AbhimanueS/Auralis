import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

const router = express.Router();

const MAX_CHARS = 35_000;

function clampText(input) {
  const t = String(input ?? '').trim();
  if (!t) return '';
  return t.length > MAX_CHARS ? t.slice(0, MAX_CHARS) : t;
}

function fallbackOverview(text) {
  const cleaned = text
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .trim();

  const lines = cleaned
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const keyTopics = [];
  for (const l of lines) {
    const m =
      l.match(/^(\d+[\.\)]\s+)(.+)$/) ||
      l.match(/^[-*•]\s+(.+)$/) ||
      l.match(/^(unit|module|chapter|topic)\s*\d*[:\-]?\s*(.+)$/i);
    if (m) {
      const topic = (m[2] || m[1] || '').trim();
      if (topic && !keyTopics.includes(topic)) keyTopics.push(topic);
    }
    if (keyTopics.length >= 12) break;
  }

  const sample = lines.slice(0, 12).join('\n');
  const overview =
    keyTopics.length > 0
      ? `This syllabus covers ${keyTopics.slice(0, 6).join(', ')}${keyTopics.length > 6 ? ', …' : ''}.`
      : `Here’s a short overview based on what you pasted:\n\n${sample}${lines.length > 12 ? '\n…' : ''}`;

  const examFocus =
    keyTopics.length > 0
      ? `Focus on understanding definitions + core problem types for each topic. Start with the highest-weight units (if any are mentioned), then practice past questions.`
      : `If you tell me which units are most important for the exam, I can prioritize them into a short plan.`;

  return { overview, keyTopics, examFocus, provider: 'fallback' };
}

function getGeminiModel() {
  if (!process.env.GEMINI_API_KEY) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

async function geminiOverview(text) {
  const model = getGeminiModel();
  if (!model) return null;

  const prompt = [
    'You are a helpful study assistant. Summarize a syllabus/exam portions into a short, clear overview.',
    'Return STRICT JSON with keys: overview (string), keyTopics (array of strings), examFocus (string).',
    'Keep overview under 120 words. keyTopics: 6-10 items.',
    '',
    'SYLLABUS:',
    text,
  ].join('\n');

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const raw = result.response?.text?.() || '';
  const jsonText = raw.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const parsed = JSON.parse(jsonText);
  return {
    overview: String(parsed.overview ?? ''),
    keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics.map(String) : [],
    examFocus: String(parsed.examFocus ?? ''),
    provider: 'gemini',
  };
}

async function openaiOverview(text) {
  if (!process.env.OPENAI_API_KEY) return null;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const system =
    'You are a helpful study assistant. You summarize syllabi into concise, exam-focused notes. Output strict JSON only.';

  const user = [
    'Summarize this syllabus/exam portions.',
    'Return STRICT JSON with keys: overview (string), keyTopics (array of strings), examFocus (string).',
    'Keep overview under 120 words. keyTopics: 6-10 items.',
    '',
    text,
  ].join('\n');

  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });

  const content = resp.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return {
    overview: String(parsed.overview ?? ''),
    keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics.map(String) : [],
    examFocus: String(parsed.examFocus ?? ''),
    provider: 'openai',
  };
}

// POST /api/studymate/overview
router.post('/overview', async (req, res) => {
  const text = clampText(req.body?.text);
  if (!text || text.length < 30) {
    return res.status(400).json({ message: 'Please paste at least 30 characters of syllabus text.' });
  }

  try {
    const gem = await geminiOverview(text).catch(() => null);
    if (gem) return res.json(gem);

    const oai = await openaiOverview(text).catch(() => null);
    if (oai) return res.json(oai);

    return res.json(fallbackOverview(text));
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Studymate request failed.' });
  }
});

export default router;

