const mongoose = require('mongoose');

// ── Schema ────────────────────────────────────────────────────
const birthdayPageSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true, trim: true },
        receiver_name: { type: String, required: true },
        sender_name: { type: String, required: true },
        is_active: { type: Boolean, default: true },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

const BirthdayPage =
    mongoose.models.BirthdayPage ||
    mongoose.model('BirthdayPage', birthdayPageSchema);

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

    const { slug } = req.query;
    try {
        await connectDB();
        const page = await BirthdayPage.findOne({ slug, is_active: true }).lean();
        if (!page) return res.status(404).json({ error: 'Page not found' });
        return res.json(page);
    } catch (err) {
        console.error('[GET /api/pages/:slug]', err);
        return res.status(500).json({ error: err.message });
    }
};
