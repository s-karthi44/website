/**
 * BirthdayDrop — MongoDB Seed Script
 * Run with: node server/seed.js
 *
 * Creates a demo birthday page and sample wishes in MongoDB.
 * Edit the data below before running!
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/birthdaydrop';

// ── Schemas (inline so seed.js is standalone) ─────────────────
const pageSchema = new mongoose.Schema({
    slug: { type: String, unique: true },
    receiver_name: String,
    sender_name: String,
    is_active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

const wishSchema = new mongoose.Schema({
    page_id: mongoose.Schema.Types.ObjectId,
    from_name: String,
    message: String,
    tag: String,
    color: { type: String, default: '#D4A853' },
    emoji: { type: String, default: '💌' },
    is_sender: { type: Boolean, default: false },
    is_mystery: { type: Boolean, default: false },
    display_order: { type: Number, default: 1 },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

const BirthdayPage = mongoose.model('BirthdayPage', pageSchema);
const Wish = mongoose.model('Wish', wishSchema);

// ── Seed data — edit these! ────────────────────────────────────
const PAGE = {
    slug: 'demo',
    receiver_name: 'Yohannaa',
    sender_name: 'Karthi',
};

const WISHES = [
    {
        from_name: 'Alice',
        message: 'Wishing you the most magical birthday ever! You deserve all the joy in the world. 🌟',
        tag: 'heartfelt',
        color: '#E8A0A0',
        emoji: '🌟',
        display_order: 1,
    },
    {
        from_name: 'vinay',
        message: 'May your day be as bright as your smile — and as chaotic as your playlist! 🎵😂',
        tag: 'funny',
        color: '#A0E8B0',
        emoji: '🎵',
        display_order: 2,
    },
    {
        from_name: 'varshini',    // Mystery sender!
        message: 'Figure out who I am... I think you know 😏 Happy Birthday!',
        tag: 'funny',
        color: '#C0A8E8',
        emoji: '🔍',
        is_mystery: true,
        display_order: 3,
    },
    {
        from_name: 'silakini',
        message: 'You inspire everyone around you. Keep shining, keep growing! ✨',
        tag: 'inspirational',
        color: '#A8C8E8',
        emoji: '✨',
        display_order: 4,
    },
    {
        from_name: 'sona',
        message: 'Happy Birthday! Sending you all the sweetness in the world 🍰',
        tag: 'sweet',
        color: '#F0D080',
        emoji: '🍰',
        display_order: 5,
    },
];

// Sender's special wish — locked until all others are opened
const SENDER_WISH = {
    from_name: 'Karthi',
    message: 'Happy Birthday Priya! 🎂\n\nYou mean the absolute world to me. Every single day with you is a gift I treasure more than words can say. Thank you for being you — brilliant, kind, and endlessly wonderful.\n\nHere\'s to many more adventures together! 💛',
    tag: 'heartfelt',
    color: '#FFD700',
    emoji: '🥳',
    is_sender: true,
    display_order: 99,
};

// ── Run ────────────────────────────────────────────────────────
async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected:', MONGO_URI);

    // Remove existing demo data
    const existing = await BirthdayPage.findOne({ slug: PAGE.slug });
    if (existing) {
        await Wish.deleteMany({ page_id: existing._id });
        await BirthdayPage.deleteOne({ _id: existing._id });
        console.log('🗑️  Removed existing demo data');
    }

    // Create page
    const page = await BirthdayPage.create(PAGE);
    console.log(`📄 Created page: "${page.slug}" (${page._id})`);

    // Create friend wishes
    const createdWishes = await Wish.insertMany(
        WISHES.map(w => ({ ...w, page_id: page._id }))
    );
    console.log(`💌 Created ${createdWishes.length} friend wishes`);

    // Create sender wish
    await Wish.create({ ...SENDER_WISH, page_id: page._id });
    console.log('⭐ Created sender\'s special wish');

    console.log('\n🎉 Done! Visit http://localhost:5173/demo to see the birthday page.\n');
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
