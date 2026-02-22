import express from 'express';
import PageSession from '../models/PageSession.js';

const router = express.Router();

/**
 * GET /api/sessions/:pageId?sessionKey=xxx
 * Gets an existing session, or creates a new one if it doesn't exist.
 */
router.get('/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params;
        const { sessionKey } = req.query;

        if (!sessionKey) {
            return res.status(400).json({ error: 'sessionKey query param required' });
        }

        // findOneAndUpdate with upsert = true acts as get-or-create
        const session = await PageSession.findOneAndUpdate(
            { page_id: pageId, session_key: sessionKey },
            { $setOnInsert: { page_id: pageId, session_key: sessionKey, opened_wish_ids: [], all_opened: false } },
            { upsert: true, new: true, lean: true }
        );

        res.json(session);
    } catch (err) {
        console.error('[GET /sessions/:pageId]', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * PATCH /api/sessions/:pageId
 * Updates opened_wish_ids and all_opened for a session.
 * Body: { sessionKey, openedWishIds, allOpened }
 */
router.patch('/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params;
        const { sessionKey, openedWishIds, allOpened } = req.body;

        if (!sessionKey) {
            return res.status(400).json({ error: 'sessionKey is required in body' });
        }

        const session = await PageSession.findOneAndUpdate(
            { page_id: pageId, session_key: sessionKey },
            { $set: { opened_wish_ids: openedWishIds, all_opened: allOpened } },
            { new: true, lean: true }
        );

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json(session);
    } catch (err) {
        console.error('[PATCH /sessions/:pageId]', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
