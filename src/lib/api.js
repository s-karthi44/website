/**
 * BirthdayDrop — Static API client
 * ─────────────────────────────────────────────────────────────────────────
 * No backend or database needed — all data comes from src/data/birthdayData.js
 * Sessions (opened wishes) are persisted in localStorage.
 */

import { ALL_PAGES, ALL_WISHES } from '../data/birthdayData.js';

// Small artificial delay so loading states feel natural (optional)
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

// ── Pages ─────────────────────────────────────────────────────

/** Fetch a birthday page by slug */
export async function getPageBySlug(slug) {
    await delay();
    const page = ALL_PAGES.find((p) => p.slug === slug && p.is_active);
    if (!page) throw new Error('404 Page not found');
    return page;
}

/** Fetch all friend wishes for a page */
export async function getWishes(pageId) {
    await delay();
    return ALL_WISHES
        .filter((w) => w.page_id === pageId && !w.is_sender)
        .sort((a, b) => a.display_order - b.display_order);
}

/** Fetch the sender's special wish */
export async function getSenderWish(pageId) {
    await delay();
    const wish = ALL_WISHES.find((w) => w.page_id === pageId && w.is_sender);
    if (!wish) throw new Error('Sender wish not found');
    return wish;
}

// ── Sessions (localStorage) ───────────────────────────────────

function sessionKey(pageId) {
    return `bd_session_${pageId}`;
}

function readSession(pageId) {
    try {
        const raw = localStorage.getItem(sessionKey(pageId));
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeSession(pageId, data) {
    try {
        localStorage.setItem(sessionKey(pageId), JSON.stringify(data));
    } catch {
        // storage quota exceeded — silently ignore
    }
}

/** Get or create a session for this page + session key */
export async function getOrCreateSession(pageId, sessionKeyParam) {
    await delay(60);
    let session = readSession(pageId);
    if (!session) {
        session = {
            page_id: pageId,
            session_key: sessionKeyParam,
            opened_wish_ids: [],
            all_opened: false,
        };
        writeSession(pageId, session);
    }
    return session;
}

/** Update opened wish IDs and all_opened in the session */
export async function updateSession(pageId, _sessionKey, openedWishIds, allOpened) {
    await delay(60);
    const session = readSession(pageId) || { page_id: pageId };
    const updated = { ...session, opened_wish_ids: openedWishIds, all_opened: allOpened };
    writeSession(pageId, updated);
    return updated;
}
