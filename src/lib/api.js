/**
 * BirthdayDrop — API client
 * All requests go to the Express + MongoDB backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
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
    request(`/api/pages/${pageId}/wishes`);

/** Fetch the sender's special wish (lazy, on unlock) */
export const getSenderWish = (pageId) =>
    request(`/api/pages/${pageId}/sender-wish`);

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
