import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import entryRoutes from './routes/entries.js';
import aiRoutes from './routes/ai.js';
import studymateRoutes from './routes/studymate.js';
import routineRoutes from './routes/routine.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auralis';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

mongoose.connect(MONGO_URI).then(() => console.log('MongoDB connected')).catch((e) => console.error(e));

app.use('/api/auth', authRoutes);
app.use('/api/entries', authMiddleware, entryRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/studymate', authMiddleware, studymateRoutes);
app.use('/api/routine', authMiddleware, routineRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
