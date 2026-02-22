/**
 * BirthdayDrop — API client
 * Uses relative paths: works on Vercel (serverless) and locally (Vite proxy).
 *
 * Route map (matches /api/* serverless functions):
 *   GET  /api/pages/:slug            → api/pages/[slug].js
 *   GET  /api/wishes/:pageId         → api/wishes/[pageId].js
 *   GET  /api/sender-wish/:pageId    → api/sender-wish/[pageId].js
 *   GET  /api/sessions/:pageId       → api/sessions/[pageId].js
 *   PATCH /api/sessions/:pageId      → api/sessions/[pageId].js
 */

async function request(path, options = {}) {
    const res = await fetch(path, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
    }

    return data;
}

// ── Pages ─────────────────────────────────────────────────────

/** Fetch a birthday page by slug */
export const getPageBySlug = (slug) =>
    request(`/api/pages/${slug}`);

/** Fetch all friend wishes for a page */
export const getWishes = (pageId) =>
    request(`/api/wishes/${pageId}`);

/** Fetch the sender's special wish (lazy, on unlock) */
export const getSenderWish = (pageId) =>
    request(`/api/sender-wish/${pageId}`);

// ── Sessions ──────────────────────────────────────────────────

/** Get or create a session for this page + session key */
export const getOrCreateSession = (pageId, sessionKey) =>
    request(`/api/sessions/${pageId}?sessionKey=${encodeURIComponent(sessionKey)}`);

/** Update opened wish IDs and all_opened in the session */
export const updateSession = (pageId, sessionKey, openedWishIds, allOpened) =>
    request(`/api/sessions/${pageId}`, {
        method: 'PATCH',
        body: JSON.stringify({ sessionKey, openedWishIds, allOpened }),
    });
