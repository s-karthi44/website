const mongoose = require('mongoose');

// ── Schema ────────────────────────────────────────────────────
const pageSessionSchema = new mongoose.Schema(
    {
        page_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BirthdayPage', required: true },
        session_key: { type: String, required: true },
        opened_wish_ids: { type: [mongoose.Schema.Types.ObjectId], default: [] },
        all_opened: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);
pageSessionSchema.index({ page_id: 1, session_key: 1 }, { unique: true });

const PageSession =
    mongoose.models.PageSession || mongoose.model('PageSession', pageSessionSchema);

// ── MongoDB connection cache ───────────────────────────────────
let cached = global._mongoConn || (global._mongoConn = { conn: null, promise: null });

async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// ── Handler ───────────────────────────────────────────────────
module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { pageId } = req.query;
    await connectDB();

    // ── GET: get or create session ────────────────────────────
    if (req.method === 'GET') {
        const { sessionKey } = req.query;
        if (!sessionKey) return res.status(400).json({ error: 'sessionKey query param required' });
        try {
            const session = await PageSession.findOneAndUpdate(
                { page_id: pageId, session_key: sessionKey },
                {
                    $setOnInsert: {
                        page_id: pageId,
                        session_key: sessionKey,
                        opened_wish_ids: [],
                        all_opened: false,
                    },
                },
                { upsert: true, new: true, lean: true }
            );
            return res.json(session);
        } catch (err) {
            console.error('[GET /api/sessions/:pageId]', err);
            return res.status(500).json({ error: err.message });
        }
    }

    // ── PATCH: update session ─────────────────────────────────
    if (req.method === 'PATCH') {
        const { sessionKey, openedWishIds, allOpened } = req.body;
        if (!sessionKey) return res.status(400).json({ error: 'sessionKey is required in body' });
        try {
            const session = await PageSession.findOneAndUpdate(
                { page_id: pageId, session_key: sessionKey },
                { $set: { opened_wish_ids: openedWishIds, all_opened: allOpened } },
                { new: true, lean: true }
            );
            if (!session) return res.status(404).json({ error: 'Session not found' });
            return res.json(session);
        } catch (err) {
            console.error('[PATCH /api/sessions/:pageId]', err);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
