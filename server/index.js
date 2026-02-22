import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import pagesRouter from './routes/pages.js';
import wishesRouter from './routes/wishes.js';
import senderWishRouter from './routes/senderWish.js';
import sessionsRouter from './routes/sessions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/birthdaydrop';

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date() }));

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/pages', pagesRouter);
app.use('/api/wishes', wishesRouter);
app.use('/api/sender-wish', senderWishRouter);
app.use('/api/sessions', sessionsRouter);

// ── 404 handler ────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ── MongoDB connect + start ────────────────────────────────────
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log(`✅  MongoDB connected: ${MONGO_URI}`);
        app.listen(PORT, () =>
            console.log(`🚀  BirthdayDrop API running at http://localhost:${PORT}`)
        );
    })
    .catch(err => {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1);
    });
