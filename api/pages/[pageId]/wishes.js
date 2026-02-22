const mongoose = require('mongoose');

// ── Schema ────────────────────────────────────────────────────
const wishSchema = new mongoose.Schema(
    {
        page_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BirthdayPage', required: true },
        from_name: { type: String, required: true },
        message: { type: String, required: true },
        tag: {
            type: String,
            required: true,
            enum: ['heartfelt', 'funny', 'inspirational', 'sweet'],
        },
        color: { type: String, default: '#D4A853' },
        emoji: { type: String, default: '💌' },
        is_sender: { type: Boolean, default: false },
        is_mystery: { type: Boolean, default: false },
        display_order: { type: Number, default: 1 },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

const Wish = mongoose.models.Wish || mongoose.model('Wish', wishSchema);

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
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { pageId } = req.query;
    try {
        await connectDB();
        const wishes = await Wish.find({ page_id: pageId, is_sender: false })
            .sort({ display_order: 1 })
            .lean();
        return res.json(wishes);
    } catch (err) {
        console.error('[GET /api/pages/:pageId/wishes]', err);
        return res.status(500).json({ error: err.message });
    }
};
