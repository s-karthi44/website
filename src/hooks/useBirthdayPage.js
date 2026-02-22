import { useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    getPageBySlug,
    getWishes,
    getSenderWish,
    getOrCreateSession,
    updateSession,
} from '../lib/api';
import { useAppState } from '../context/AppContext';

/**
 * Loads page data for a given slug on mount.
 * Manages sessions and restores opened-wish state from the backend.
 */
export function useBirthdayPage(slug) {
    const { state, dispatch } = useAppState();

    useEffect(() => {
        if (!slug) return;
        fetchPage(slug, dispatch);
    }, [slug]);

    return { state, dispatch };
}

async function fetchPage(slug, dispatch) {
    try {
        // 1) Fetch birthday page
        let page;
        try {
            page = await getPageBySlug(slug);
        } catch (err) {
            if (err.message.includes('404') || err.message.toLowerCase().includes('not found')) {
                dispatch({ type: 'SET_ERROR', payload: 'not_found' });
                return;
            }
            throw err;
        }

        dispatch({ type: 'SET_PAGE', payload: page });

        // 2) Fetch friend wishes (is_sender = false)
        const wishes = await getWishes(page._id);
        dispatch({ type: 'SET_WISHES', payload: wishes || [] });

        // 3) Session management — key stored per-page in localStorage
        const storageKey = `bd_session_key_${page._id}`;
        let sessionKey = localStorage.getItem(storageKey);
        if (!sessionKey) {
            sessionKey = uuidv4();
            localStorage.setItem(storageKey, sessionKey);
        }

        const session = await getOrCreateSession(page._id, sessionKey);

        const openedWishIds = session.opened_wish_ids || [];
        const allOpened = session.all_opened || false;

        // Rehydrate tasks from session state
        const tasksCompleted = {
            openedFirst: openedWishIds.length > 0,
            foundFunny: (wishes || []).some(w => w.tag === 'funny' && openedWishIds.includes(w._id)),
            foundMystery: (wishes || []).some(w => w.is_mystery && openedWishIds.includes(w._id)),
            openedAll: allOpened,
        };

        dispatch({
            type: 'SET_SESSION',
            payload: {
                sessionKey,
                openedWishIds,
                allOpened,
                tasksCompleted,
                unlockPhase: allOpened ? 'unlocked' : 'locked',
                loading: false,
            },
        });
    } catch (err) {
        console.error('[BirthdayDrop] fetchPage error:', err);
        dispatch({ type: 'SET_ERROR', payload: err.message || 'unknown' });
    }
}

/**
 * Marks a wish as opened — updates local state + syncs to backend.
 */
export function useOpenWish() {
    const { state, dispatch } = useAppState();

    const openWish = useCallback(async (wishId) => {
        if (!state.sessionKey || !state.page) return;
        if (state.openedWishIds.includes(wishId)) return;

        // Optimistic local update first (fast UI)
        dispatch({ type: 'OPEN_WISH', payload: wishId });

        const newOpenedIds = [...state.openedWishIds, wishId];
        const allOpened = state.wishes.length > 0 &&
            state.wishes.every(w => newOpenedIds.includes(w._id));

        // Persist to MongoDB via API
        try {
            await updateSession(state.page._id, state.sessionKey, newOpenedIds, allOpened);
        } catch (err) {
            console.error('[BirthdayDrop] updateSession error:', err);
        }
    }, [state, dispatch]);

    return openWish;
}

/**
 * Fetches the sender's special wish lazily (only on unlock).
 */
export function useFetchSenderWish() {
    const { state, dispatch } = useAppState();

    const fetchSenderWish = useCallback(async () => {
        if (!state.page || state.senderWish) return;
        try {
            const wish = await getSenderWish(state.page._id);
            dispatch({ type: 'SET_SENDER_WISH', payload: wish });
        } catch (err) {
            console.error('[BirthdayDrop] fetchSenderWish error:', err);
        }
    }, [state.page, state.senderWish, dispatch]);

    return fetchSenderWish;
}
