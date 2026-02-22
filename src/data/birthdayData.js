/**
 * BirthdayDrop — Static Data
 * ─────────────────────────────────────────────────────────────────────────
 * No database needed! Edit this file to customise the birthday experience,
 * then push to GitHub — Vercel will auto-deploy the changes.
 *
 * HOW TO CREATE A NEW BIRTHDAY PAGE:
 *   1. Edit PAGE (receiver name, sender name, slug)
 *   2. Edit WISHES (add/remove/change wishes from friends)
 *   3. Edit SENDER_WISH (the special locked message)
 *   4. Push to GitHub → Vercel auto-deploys → share the URL /<slug>
 */

// ── The Birthday Page ─────────────────────────────────────────
export const PAGE = {
    _id: 'demo-page-001',
    slug: 'demo',
    receiver_name: 'Yohannaa',
    sender_name: 'Karthi',
    is_active: true,
};

// ── Friend Wishes ─────────────────────────────────────────────
export const WISHES = [
    {
        _id: 'wish-001',
        page_id: 'demo-page-001',
        from_name: 'Alice',
        message: 'Wishing you the most magical birthday ever! You deserve all the joy in the world. 🌟',
        tag: 'heartfelt',
        color: '#E8A0A0',
        emoji: '🌟',
        is_sender: false,
        is_mystery: false,
        display_order: 1,
    },
    {
        _id: 'wish-002',
        page_id: 'demo-page-001',
        from_name: 'vinay',
        message: 'May your day be as bright as your smile — and as chaotic as your playlist! 🎵😂',
        tag: 'funny',
        color: '#A0E8B0',
        emoji: '🎵',
        is_sender: false,
        is_mystery: false,
        display_order: 2,
    },
    {
        _id: 'wish-003',
        page_id: 'demo-page-001',
        from_name: 'varshini',
        message: 'Figure out who I am... I think you know 😏 Happy Birthday!',
        tag: 'funny',
        color: '#C0A8E8',
        emoji: '🔍',
        is_sender: false,
        is_mystery: true,
        display_order: 3,
    },
    {
        _id: 'wish-004',
        page_id: 'demo-page-001',
        from_name: 'silakini',
        message: 'You inspire everyone around you. Keep shining, keep growing! ✨',
        tag: 'inspirational',
        color: '#A8C8E8',
        emoji: '✨',
        is_sender: false,
        is_mystery: false,
        display_order: 4,
    },
    {
        _id: 'wish-005',
        page_id: 'demo-page-001',
        from_name: 'sona',
        message: 'Happy Birthday! Sending you all the sweetness in the world 🍰',
        tag: 'sweet',
        color: '#F0D080',
        emoji: '🍰',
        is_sender: false,
        is_mystery: false,
        display_order: 5,
    },
];

// ── Sender's Special Wish (unlocked when all others are opened) ─
export const SENDER_WISH = {
    _id: 'wish-sender',
    page_id: 'demo-page-001',
    from_name: 'Karthi',
    message: `Happy Birthday Yohannaa! 🎂\n\nYou mean the absolute world to me. Every single day with you is a gift I treasure more than words can say. Thank you for being you — brilliant, kind, and endlessly wonderful.\n\nHere's to many more adventures together! 💛`,
    tag: 'heartfelt',
    color: '#FFD700',
    emoji: '🥳',
    is_sender: true,
    is_mystery: false,
    display_order: 99,
};

// ── All pages lookup (add more pages here for multiple birthday pages) ──
export const ALL_PAGES = [PAGE];
export const ALL_WISHES = [...WISHES, SENDER_WISH];
